import queueRecordUtils from './queue-record-utils';
import SapClient from '../sap-client';

describe('parseQueueRecord function should parse the required fields from the queue record and store it in the queues list', () => {
  test('Should successfully parse queue records and store the required values in queues list', () => {
    const sapClient = new SapClient();
    const numberOfFilesRead = 0;
    const mockQueueRecordUtils = jest.spyOn(queueRecordUtils, 'parseQueueRecord');
    const recordData =
      '01!04                3                00000000400000000Customer Demand Jobs!';
    const recordData1 =
      '01!10                3                10000000800000000Reports             !';
    sapClient.parseData(recordData, numberOfFilesRead);
    sapClient.parseData(recordData1, numberOfFilesRead);
    const expectedResult = [
      {
        queueName: '04',
        queueDescription: 'Customer Demand Jobs',
        jobLimit: '4',
        streams: []
      },
      {
        queueName: '10',
        queueDescription: 'Reports             ',
        jobLimit: '8',
        streams: []
      }
    ];
    expect(mockQueueRecordUtils).toHaveBeenCalledTimes(2);
    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });
});
