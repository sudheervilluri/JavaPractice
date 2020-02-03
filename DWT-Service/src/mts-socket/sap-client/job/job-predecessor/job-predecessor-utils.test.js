import JobPredecessorUtils from './job-predecessor-utils';
import SapClient from '../../sap-client';

describe('parseJobPredecessor function should parse the required fields from job record and store it in the jobs list', () => {
  test('Shoud successfully format all fields and store it in jobs list', () => {
    const sapClient = new SapClient();

    const fakeData = {
      queueName: '00',
      jobLimit: '4',
      queueDescription: 'Scheduled Queue     ',
      streams: [
        {
          jobs: new Map([
            [
              '001START',
              {
                jobName: '001START',
                predecessors: []
              }
            ],
            [
              '02CLNTSK',
              {
                jobName: '02CLNTSK',
                predecessors: []
              }
            ],
            [
              '03RWPBAP',
              {
                jobName: '03RWPBAP',
                predecessors: []
              }
            ],
            [
              '0LOADSCH',
              {
                jobName: '0LOADSCH',
                predecessors: []
              }
            ],
            [
              'LOADCUBE',
              {
                jobName: 'LOADCUBE',
                predecessors: []
              }
            ]
          ])
        }
      ]
    };

    sapClient.allFiles.schedFile.queues.push(fakeData);

    let recordData = '01!00D01START02CLNTSK8001START!';
    JobPredecessorUtils.parseJobPredecessor(recordData, sapClient);

    recordData = '01!00D01START0LOADSCH8001START!';
    JobPredecessorUtils.parseJobPredecessor(recordData, sapClient);

    recordData = '01!00D01START0LOADSCH802CLNTSK!';
    JobPredecessorUtils.parseJobPredecessor(recordData, sapClient);

    recordData = '01!00D01START03RWPBAP8001START!';
    JobPredecessorUtils.parseJobPredecessor(recordData, sapClient);

    recordData = '01!00D01START03RWPBAP802CLNTSK!';
    JobPredecessorUtils.parseJobPredecessor(recordData, sapClient);

    recordData = '01!00D01START03RWPBAP802CLNTSK!';
    JobPredecessorUtils.parseJobPredecessor(recordData, sapClient);

    const expectedResult = [
      {
        queueName: '00',
        jobLimit: '4',
        queueDescription: 'Scheduled Queue     ',
        streams: [
          {
            jobs: new Map([
              [
                '001START',
                {
                  jobName: '001START',
                  predecessors: []
                }
              ],
              [
                '02CLNTSK',
                {
                  jobName: '02CLNTSK',
                  predecessors: [
                    {
                      streamOrJobName: '001START'
                    }
                  ]
                }
              ],
              [
                '03RWPBAP',
                {
                  jobName: '03RWPBAP',
                  predecessors: [
                    {
                      streamOrJobName: '001START'
                    },
                    {
                      streamOrJobName: '02CLNTSK'
                    }
                  ]
                }
              ],
              [
                '0LOADSCH',
                {
                  jobName: '0LOADSCH',
                  predecessors: [
                    {
                      streamOrJobName: '001START'
                    },
                    {
                      streamOrJobName: '02CLNTSK'
                    }
                  ]
                }
              ],
              [
                'LOADCUBE',
                {
                  jobName: 'LOADCUBE',
                  predecessors: []
                }
              ]
            ])
          }
        ]
      }
    ];

    expect(sapClient.allFiles.schedFile.queues).toEqual(expectedResult);
  });
});
