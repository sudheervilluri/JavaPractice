import StreamPredecessorsUtils from './stream-predecessor-utils';
import SapClient from '../../sap-client';

describe('parseStreamPredecessor function should parse the required fields from the stream record and store it in the streams list', () => {
  test('Should successfully format all fields and store it in streams list', () => {
    const sapClient = new SapClient();

    const fakeData = {
      queueId: '03',
      jobLimit: '4',
      queueDescription: 'Fact Queue          ',
      streams: [
        {
          streamName: 'DMLFNGSR ',
          predecessors: []
        },
        {
          streamName: 'DMLCLNMV ',
          predecessors: []
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    let recordData = '01!03DMLFNGSR        5DMILVALC!';
    StreamPredecessorsUtils.parseStreamPredecessor(recordData, sapClient);

    recordData = '01!03DMLFNGSR        5DMILVALG!';
    StreamPredecessorsUtils.parseStreamPredecessor(recordData, sapClient);

    recordData = '01!03DMLCLNMV        5DMILVALC!';
    StreamPredecessorsUtils.parseStreamPredecessor(recordData, sapClient);

    recordData = '01!03DMLCLNMV        5DMILVALC!';
    StreamPredecessorsUtils.parseStreamPredecessor(recordData, sapClient);

    const expectedResult = [
      {
        queueId: '03',
        jobLimit: '4',
        queueDescription: 'Fact Queue          ',
        streams: [
          {
            streamName: 'DMLFNGSR ',
            predecessors: [
              {
                streamOrJobName: 'DMILVALC'
              },
              {
                streamOrJobName: 'DMILVALG'
              }
            ]
          },
          {
            streamName: 'DMLCLNMV ',
            predecessors: [
              {
                streamOrJobName: 'DMILVALC'
              }
            ]
          }
        ]
      }
    ];

    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });
});
