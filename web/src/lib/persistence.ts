import { Game  } from './game';
import AWS from 'aws-sdk';

/**
 * Save the results of a game to the database.
 */
export function saveResults(game : Game) {
  if (game.persisted) return game;

  try {
    console.log("Connecting to the database to record results...")

    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    console.log("Connection successful")

    game.correctAnswers.forEach((company, i) => {
      const correct = game.guesses[i] == company;

      console.log(`Saving answer ${correct}`)

      dynamoDb.update({
        TableName: 'malcolm-web-results',
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
        else {
          console.log("Update sucessful")
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
    console.log("Connecting to the database to retrieve totals...")

    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    console.log("Connection successful")

    const results = await dynamoDb.scan({ TableName: 'malcolm-web-results' }).promise();

    console.log("Pulled back results")

    if (!results.Items)  {
      console.log("Result set is empty")
      return null;
    }

    console.log(`Pulled back ${results.Items.length} results, filtering and ordering...`)

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
      console.log(`Filtered down to ${companies.length} companies, that's not enough!`)

      return null;
    }

    console.log("Returning top and bottom 5 companies.")

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