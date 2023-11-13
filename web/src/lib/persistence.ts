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
    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    for (const [i, company] of game.correctAnswers.entries()) {
      if (company == null) continue

      const correct = game.guesses[i] == company;

      try {
        console.log(`Creating row for ${company}`)

        dynamoDb.put({
          TableName: 'malcolm-web-results',
          Item: {
            "company"   : company,
            "correct"   : 0,
            "incorrect" : 0
          },
          ConditionExpression: "attribute_not_exists(company)"
        }, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        })

        console.log(`Created row for ${company}`)
      }
      catch (e) {
        // We expect this to fail if the row already exists.
        console.error('Error inserting item in DynamoDB:', error);
      }

      console.log(`Incrementing count for ${company}`)

      dynamoDb.update({
        TableName: 'malcolm-web-results',
        Key: {
          partitionKey: company
        },
        UpdateExpression: 'SET correct = correct + :right, incorrect =  incorrect + :right',
        ExpressionAttributeValues: {
          ':right': correct ? 1 : 0,
          ':wrong': correct ? 0 : 1
        }
      }, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });

      console.log(`Incremented count for ${company}`)
    }
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
    console.error('Error reading data from DynamoDB:', error);
  }

  return null;
}