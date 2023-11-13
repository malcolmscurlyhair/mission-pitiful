import { Game  } from './game';
import AWS from 'aws-sdk';

/**
 * Save the results of a game to the database.
 */
export async function saveResults(game : Game) {
  if (game.persisted) {
    console.log('Game already persisted, not saving results again...')
    return game;
  }

  try {
    console.log("Connecting to DynamoDB...")

    const dynamoDb = new AWS.DynamoDB.DocumentClient()
    const inserts  = []
    const updates  = []

    for (const [i, company] of game.correctAnswers.entries()) {
      if (company == null) continue

      inserts.push({
        PutRequest: {
          company:   company,
          correct:   0,
          incorrect: 0
        }
      })

      const correct = game.guesses[i] == company;

      updates.push({
        TableName: 'results',
        Key: { company: company },
        UpdateExpression: 'SET correct = correct + :right, incorrect = incorrect + :wrong',
        ExpressionAttributeValues: {
          ':right': correct ? 1 : 0,
          ':wrong': correct ? 0 : 1
        }
      })
    }

    console.log("Insert empty rows before incrementing values...")

    const inserted = await dynamoDb.batchWrite(params = {
      RequestItems: {
        results: inserts
      },
    }).promise();

    console.log(`Ran batched insert got response: ${inserted}`)
    console.log('Proceeding to updates')

    for (update in updates) {
      const updated = await dynamoDb.put(params = update).promise();

      console.log(`Ran singular update, got response: ${update}`)
    }

  } catch (error) {
    console.log('Error writing to DynamoDB:', error);
  }

  game.persisted = true;

  return game
}

/**
 * Retrieve the top 5 and bottom 5 companies that users get right and wrong.
 */
export async function getTotals() {
  try {
    console.log("Running full table scan to get stats...")

    const dynamoDb = new AWS.DynamoDB.DocumentClient()
    const results  = await dynamoDb.scan({ TableName: 'results' }).promise();

    if (!results.Items)  {
      console.log("Result set is empty")
      return null;
    }

    console.log(`Pulled back ${results.Items.length} results, filtering and ordering...`)

    const companies = results.Items.map((row) => {
      console.log(row)

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
    console.log('Error reading data from DynamoDB:', error);
  }

  return null;
}