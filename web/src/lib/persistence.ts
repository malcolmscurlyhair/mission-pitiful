import { Game  } from './game';
import AWS from 'aws-sdk';

/**
 * Save the results of a game to the database.
 */
export function saveResults(game : Game) {
  if (game.persisted) return game;

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  try {
    game.correctAnswers.each((company, i) => {
      const correct = game.guesses[i] == company;

      dynamoDb.update({
        TableName: 'results',
        Key: {
          partitionKey: company
        },
        UpdateExpression: 'SET correct = correct + :right, incorrect =  + incorrect + :right',
        ExpressionAttributeValues: {
          ':right': correct ? 1 : 0,
          ':wrong': correct ? 0 : 1
        }
      }, (error, data) => {
        if (error) {
          console.error('Error updating item in DynamoDB:', error);
        }
      });
    })
  } catch (error) {
    console.error('Error writing to DynamoDB:', error);
  }

  game.persisted = true;

  return game
}

/**
 * Retrieve the top 5 and bottom 5 companies that users get right and wrong.
 */
export async function getTotals() {
  try {
    const result = await dynamoDb.scan({ TableName: 'results' }).promise();

    if (!result.Items)  return null;

    const companies = results.Items.map((row) => {
      const result = {
        company:    row.company,
        correct:    row.correct    || 0,
        incorrect:  row.incorrect  || 0
      }

      results.total = row.correct + row.incorrect;

      if (result.total > 0) {
        result.percentage = ((row.correct / result.total) * 100).toFixed(1)
      }
      else {
        result.percentage = 0
      }

      return result;
    }).filter((result) => result.percentage).sort((a, b) => b.percentage - a.percentage)

    if (companies.length < 10) {
      // We want to return top and bottom 5.
      return null;
    }

    return {
      top:    companies.slice(0, 5),
      bottom: companies.slice(-5).reverse()
    };
  }
  catch (error) {
    console.error('Error reading data from DynamoDB:', error);
  }

  return null;
}