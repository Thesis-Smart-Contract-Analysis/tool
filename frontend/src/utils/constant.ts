import { env } from '@/config/environment';

export const BASE_URL =
  env.NODE_ENV === 'development'
    ? `${env.LOCAL_API_URL}:${env.LOCAL_API_PORT}`
    : env.API_URL;

export const SLITHER_LINK = 'https://github.com/crytic/slither';
export const MYTHRIL_LINK = 'https://github.com/Consensys/mythril';

export const SEVERITY_PRIORITY = [
  'Informational',
  'Low',
  'Medium',
  'High',
  'Critical',
];

export const primary_blue_50 = '#eff9ff';
export const primary_blue_100 = '#def1ff';
export const primary_blue_200 = '#b6e6ff';
export const primary_blue_300 = '#75d4ff';
export const primary_blue_400 = '#2cbeff';
export const primary_blue_500 = '#00a4f4';
export const primary_blue_600 = '#0084d4';
export const primary_blue_700 = '#0069ab';
export const primary_blue_800 = '#00598d';
export const primary_blue_900 = '#064a74';
export const primary_blue_950 = '#042f4d';

export const neutrals_50 = '#f6f6f6';
export const neutrals_100 = '#e7e7e7';
export const neutrals_200 = '#d1d1d1';
export const neutrals_300 = '#b0b0b0';
export const neutrals_400 = '#888888';
export const neutrals_500 = '#6d6d6d';
export const neutrals_600 = '#5d5d5d';
export const neutrals_700 = '#4f4f4f';
export const neutrals_800 = '#454545';
export const neutrals_900 = '#3d3d3d';
export const neutrals_950 = '#000000';

export const so1scan_color = '#00a4f4';
export const slither_color = '#ad1f2c';
export const mythril_color = '#2c56dd';

export const SAMPLE_SEMGREP_RESULT = {
  errors: [],
  findings: [
    {
      matches: [
        {
          end: {
            col: 23,
            line: 7,
            offset: 201,
          },
          lines: 'pragma solidity ^0.5.0;',
          path: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          start: {
            col: 1,
            line: 7,
            offset: 179,
          },
        },
      ],
      metadata: {
        category: 'security',
        cwe: 'CWE-664: Improper Control of a Resource Through its Lifetime',
        id: 'swe-103',
        message:
          'Contracts should be deployed with the same compiler version and flags that they have been tested with thoroughly. Locking the pragma helps to ensure that contracts do not accidentally get deployed using, for example, an outdated compiler version that might introduce bugs that affect the contract system negatively.',
        name: 'floating-compiler-version',
        references: [
          'https://swcregistry.io/docs/SWC-103/',
          'https://cwe.mitre.org/data/definitions/664.html',
          'https://semgrep.dev/docs/kb/rules/match-absence',
        ],
        severity: 'Low',
      },
    },
    {
      matches: [
        {
          end: {
            col: 17,
            line: 9,
            offset: 220,
          },
          lines: 'contract Relayer {',
          path: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          start: {
            col: 10,
            line: 9,
            offset: 213,
          },
        },
      ],
      metadata: {
        category: 'security',
        cwe: 'CWE-665: Improper Initialization',
        id: 'swe-118',
        message:
          "The absence of an explicitly defined constructor in smart contract `Relayer` will result in the automatic generation of a default constructor with the code `constructor() {}`. This can occur due to either a constructor name that doesn't match the contract name `Relayer` or an incorrectly formatted constructor declaration.",
        name: 'incorrect-constructor-name',
        references: [
          'https://swcregistry.io/docs/SWC-118/#incorrect_constructor_name1sol',
          'https://cwe.mitre.org/data/definitions/665.html',
        ],
        severity: 'High',
      },
    },
    {
      matches: [
        {
          end: {
            col: 24,
            line: 10,
            offset: 246,
          },
          lines: '    uint transactionId;',
          path: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          start: {
            col: 5,
            line: 10,
            offset: 227,
          },
        },
      ],
      metadata: {
        cwe: 'CWE-710: Improper Adherence to Coding Standards',
        id: 'swe-108',
        message:
          'Labeling the visibility for `transactionId` makes it easier to catch incorrect assumptions about who can access the variable.',
        name: 'state-variable-default-visibility',
        references: [
          'https://swcregistry.io/docs/SWC-108/',
          'https://docs.soliditylang.org/en/latest/types.html',
        ],
        severity: 'Low',
      },
    },
    {
      matches: [
        {
          end: {
            col: 39,
            line: 17,
            offset: 352,
          },
          lines: '    mapping (uint => Tx) transactions;',
          path: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          start: {
            col: 5,
            line: 17,
            offset: 318,
          },
        },
      ],
      metadata: {
        cwe: 'CWE-710: Improper Adherence to Coding Standards',
        id: 'swe-108',
        message:
          'Labeling the visibility for `transactions` makes it easier to catch incorrect assumptions about who can access the variable.',
        name: 'state-variable-default-visibility',
        references: [
          'https://swcregistry.io/docs/SWC-108/',
          'https://docs.soliditylang.org/en/latest/types.html',
        ],
        severity: 'Low',
      },
    },
    {
      matches: [
        {
          end: {
            col: 27,
            line: 24,
            offset: 719,
          },
          lines: '        transactionId += 1;',
          path: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          start: {
            col: 9,
            line: 24,
            offset: 701,
          },
        },
      ],
      metadata: {
        cwe: 'CWE-682: Incorrect Calculation',
        id: 'swe-101',
        message:
          'The operation on variable `transactionId` could lead to overflow/underflow.',
        name: 'integer-overflow-underflow',
        references: [
          'https://swcregistry.io/docs/SWC-101/',
          'https://docs.soliditylang.org/en/latest/types.html',
          'https://ethereum.stackexchange.com/questions/96482/can-division-underflow-or-overflow-in-solidity',
        ],
        severity: 'High',
      },
    },
    {
      matches: [
        {
          end: {
            col: 98,
            line: 27,
            offset: 846,
          },
          lines:
            '        (bool success, ) = address(target).call(abi.encodeWithSignature("execute(bytes)", _data));',
          path: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          start: {
            col: 9,
            line: 27,
            offset: 757,
          },
        },
      ],
      metadata: {
        category: 'security',
        cwe: 'CWE-691: Insufficient Control Flow Management',
        id: 'swe-126',
        message:
          'The gas amount is not checked before executing function in other smart contract by using `call` method.',
        name: 'insufficient-gas-griefing',
        references: ['https://swcregistry.io/docs/SWC-126/'],
        severity: 'Medium',
      },
    },
    {
      matches: [
        {
          end: {
            col: 98,
            line: 27,
            offset: 846,
          },
          lines:
            '        (bool success, ) = address(target).call(abi.encodeWithSignature("execute(bytes)", _data));',
          path: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          start: {
            col: 28,
            line: 27,
            offset: 776,
          },
        },
      ],
      metadata: {
        category: 'security',
        cwe: 'CWE-252: Unchecked Return Value',
        id: 'swe-104',
        message:
          'The return value of `call` is not checked. Execution will resume even if the called contract throws an exception. If `call` fails unintentionally or an attacker forces it to fail, this may cause unexpected behavior in the subsequent program logic.',
        name: 'unchecked-return-value',
        references: [
          'https://swcregistry.io/docs/SWC-104/',
          'https://cwe.mitre.org/data/definitions/252.html',
          'https://github.com/crytic/not-so-smart-contracts/blob/master/unchecked_external_call/KotET_source_code/KingOfTheEtherThrone.sol',
          'https://github.com/ethereumbook/ethereumbook/blob/develop/09smart-contracts-security.asciidoc#real-world-example-etherpot-and-king-of-the-ether',
        ],
        severity: 'Medium',
      },
    },
    {
      matches: [
        {
          end: {
            col: 98,
            line: 27,
            offset: 846,
          },
          lines:
            '        (bool success, ) = address(target).call(abi.encodeWithSignature("execute(bytes)", _data));',
          path: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          start: {
            col: 28,
            line: 27,
            offset: 776,
          },
        },
      ],
      metadata: {
        category: 'security',
        cwe: 'CWE-284: Improper Access Control',
        id: 'swe-105',
        message:
          'Function `relay` lacks access control, making it accessible to anyone.',
        name: 'unprotected-ether-withdrawal',
        references: [
          'https://swcregistry.io/docs/SWC-105/',
          'https://cwe.mitre.org/data/definitions/284.html',
        ],
        severity: 'High',
      },
    },
    {
      matches: [
        {
          end: {
            col: 42,
            line: 27,
            offset: 790,
          },
          lines:
            '        (bool success, ) = address(target).call(abi.encodeWithSignature("execute(bytes)", _data));',
          path: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          start: {
            col: 36,
            line: 27,
            offset: 784,
          },
        },
      ],
      metadata: {
        category: 'security',
        id: 'swe-145',
        message:
          'Be cautious when transferring ETH to address `target` as it may not exist.',
        name: 'ether-lost-in-transfer',
        references: [
          'https://docs.soliditylang.org/en/latest/types.html#members-of-addresses',
        ],
        severity: 'High',
      },
    },
    {
      matches: [
        {
          end: {
            col: 16,
            line: 33,
            offset: 926,
          },
          lines: 'contract Target {',
          path: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          start: {
            col: 10,
            line: 33,
            offset: 920,
          },
        },
      ],
      metadata: {
        category: 'security',
        cwe: 'CWE-665: Improper Initialization',
        id: 'swe-118',
        message:
          "The absence of an explicitly defined constructor in smart contract `Target` will result in the automatic generation of a default constructor with the code `constructor() {}`. This can occur due to either a constructor name that doesn't match the contract name `Target` or an incorrectly formatted constructor declaration.",
        name: 'incorrect-constructor-name',
        references: [
          'https://swcregistry.io/docs/SWC-118/#incorrect_constructor_name1sol',
          'https://cwe.mitre.org/data/definitions/665.html',
        ],
        severity: 'High',
      },
    },
  ],
  scan_time: 1.8760170936584473,
  success: true,
};

export const SAMPLE_SLITHER_RESULT = {
  errors: [],
  findings: [
    {
      matches: [
        {
          name: 'relay',
          source_mapping: {
            ending_column: 6,
            filename_absolute:
              '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
            filename_relative: 'services/uploads/relayer.sol',
            filename_short: 'services/uploads/relayer.sol',
            is_dependency: false,
            length: 519,
            lines: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            start: 358,
            starting_column: 5,
          },
          type: 'function',
          type_specific_fields: {
            parent: {
              name: 'Relayer',
              source_mapping: {
                ending_column: 2,
                filename_absolute:
                  '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
                filename_relative: 'services/uploads/relayer.sol',
                filename_short: 'services/uploads/relayer.sol',
                is_dependency: false,
                length: 675,
                lines: [
                  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                  25, 26, 27, 28, 29, 30,
                ],
                start: 204,
                starting_column: 1,
              },
              type: 'contract',
            },
            signature: 'relay(Target,bytes)',
          },
        },
        {
          name: 'require(bool,string)(transactions[transactionId].executed == false,same transaction twice)',
          source_mapping: {
            ending_column: 89,
            filename_absolute:
              '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
            filename_relative: 'services/uploads/relayer.sol',
            filename_short: 'services/uploads/relayer.sol',
            is_dependency: false,
            length: 80,
            lines: [21],
            start: 508,
            starting_column: 9,
          },
          type: 'node',
          type_specific_fields: {
            parent: {
              name: 'relay',
              source_mapping: {
                ending_column: 6,
                filename_absolute:
                  '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
                filename_relative: 'services/uploads/relayer.sol',
                filename_short: 'services/uploads/relayer.sol',
                is_dependency: false,
                length: 519,
                lines: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
                start: 358,
                starting_column: 5,
              },
              type: 'function',
              type_specific_fields: {
                parent: {
                  name: 'Relayer',
                  source_mapping: {
                    ending_column: 2,
                    filename_absolute:
                      '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
                    filename_relative: 'services/uploads/relayer.sol',
                    filename_short: 'services/uploads/relayer.sol',
                    is_dependency: false,
                    length: 675,
                    lines: [
                      9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                      24, 25, 26, 27, 28, 29, 30,
                    ],
                    start: 204,
                    starting_column: 1,
                  },
                  type: 'contract',
                },
                signature: 'relay(Target,bytes)',
              },
            },
          },
        },
      ],
      metadata: {
        confidence: 'High',
        description:
          'Relayer.relay(Target,bytes) (services/uploads/relayer.sol#19-29) compares to a boolean constant:\n\t-require(bool,string)(transactions[transactionId].executed == false,same transaction twice) (services/uploads/relayer.sol#21)\n',
        duplicated: false,
        first_markdown_element: 'services/uploads/relayer.sol#L19-L29',
        id: 'boolean-equal',
        markdown:
          '[Relayer.relay(Target,bytes)](services/uploads/relayer.sol#L19-L29) compares to a boolean constant:\n\t-[require(bool,string)(transactions[transactionId].executed == false,same transaction twice)](services/uploads/relayer.sol#L21)\n',
        severity: 'Informational',
      },
    },
    {
      matches: [],
      metadata: {
        confidence: 'High',
        description: 'solc-0.5.0 is not recommended for deployment\n',
        duplicated: false,
        first_markdown_element: '',
        id: 'solc-version',
        markdown: 'solc-0.5.0 is not recommended for deployment\n',
        severity: 'Informational',
      },
    },
    {
      matches: [
        {
          name: '^0.5.0',
          source_mapping: {
            ending_column: 24,
            filename_absolute:
              '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
            filename_relative: 'services/uploads/relayer.sol',
            filename_short: 'services/uploads/relayer.sol',
            is_dependency: false,
            length: 23,
            lines: [7],
            start: 179,
            starting_column: 1,
          },
          type: 'pragma',
          type_specific_fields: {
            directive: ['solidity', '^', '0.5', '.0'],
          },
        },
      ],
      metadata: {
        confidence: 'High',
        description:
          'Pragma version^0.5.0 (services/uploads/relayer.sol#7) allows old versions\n',
        duplicated: false,
        first_markdown_element: 'services/uploads/relayer.sol#L7',
        id: 'solc-version',
        markdown:
          'Pragma version[^0.5.0](services/uploads/relayer.sol#L7) allows old versions\n',
        severity: 'Informational',
      },
    },
    {
      matches: [
        {
          name: 'relay',
          source_mapping: {
            ending_column: 6,
            filename_absolute:
              '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
            filename_relative: 'services/uploads/relayer.sol',
            filename_short: 'services/uploads/relayer.sol',
            is_dependency: false,
            length: 519,
            lines: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            start: 358,
            starting_column: 5,
          },
          type: 'function',
          type_specific_fields: {
            parent: {
              name: 'Relayer',
              source_mapping: {
                ending_column: 2,
                filename_absolute:
                  '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
                filename_relative: 'services/uploads/relayer.sol',
                filename_short: 'services/uploads/relayer.sol',
                is_dependency: false,
                length: 675,
                lines: [
                  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                  25, 26, 27, 28, 29, 30,
                ],
                start: 204,
                starting_column: 1,
              },
              type: 'contract',
            },
            signature: 'relay(Target,bytes)',
          },
        },
        {
          name: '(success) = address(target).call(abi.encodeWithSignature(execute(bytes),_data))',
          source_mapping: {
            ending_column: 98,
            filename_absolute:
              '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
            filename_relative: 'services/uploads/relayer.sol',
            filename_short: 'services/uploads/relayer.sol',
            is_dependency: false,
            length: 89,
            lines: [27],
            start: 757,
            starting_column: 9,
          },
          type: 'node',
          type_specific_fields: {
            parent: {
              name: 'relay',
              source_mapping: {
                ending_column: 6,
                filename_absolute:
                  '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
                filename_relative: 'services/uploads/relayer.sol',
                filename_short: 'services/uploads/relayer.sol',
                is_dependency: false,
                length: 519,
                lines: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
                start: 358,
                starting_column: 5,
              },
              type: 'function',
              type_specific_fields: {
                parent: {
                  name: 'Relayer',
                  source_mapping: {
                    ending_column: 2,
                    filename_absolute:
                      '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
                    filename_relative: 'services/uploads/relayer.sol',
                    filename_short: 'services/uploads/relayer.sol',
                    is_dependency: false,
                    length: 675,
                    lines: [
                      9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                      24, 25, 26, 27, 28, 29, 30,
                    ],
                    start: 204,
                    starting_column: 1,
                  },
                  type: 'contract',
                },
                signature: 'relay(Target,bytes)',
              },
            },
          },
        },
      ],
      metadata: {
        confidence: 'High',
        description:
          'Low level call in Relayer.relay(Target,bytes) (services/uploads/relayer.sol#19-29):\n\t- (success) = address(target).call(abi.encodeWithSignature(execute(bytes),_data)) (services/uploads/relayer.sol#27)\n',
        duplicated: false,
        first_markdown_element: 'services/uploads/relayer.sol#L19-L29',
        id: 'low-level-calls',
        markdown:
          'Low level call in [Relayer.relay(Target,bytes)](services/uploads/relayer.sol#L19-L29):\n\t- [(success) = address(target).call(abi.encodeWithSignature(execute(bytes),_data))](services/uploads/relayer.sol#L27)\n',
        severity: 'Informational',
      },
    },
    {
      matches: [
        {
          additional_fields: {
            convention: 'mixedCase',
            target: 'parameter',
          },
          name: '_data',
          source_mapping: {
            ending_column: 53,
            filename_absolute:
              '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
            filename_relative: 'services/uploads/relayer.sol',
            filename_short: 'services/uploads/relayer.sol',
            is_dependency: false,
            length: 18,
            lines: [19],
            start: 388,
            starting_column: 35,
          },
          type: 'variable',
          type_specific_fields: {
            parent: {
              name: 'relay',
              source_mapping: {
                ending_column: 6,
                filename_absolute:
                  '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
                filename_relative: 'services/uploads/relayer.sol',
                filename_short: 'services/uploads/relayer.sol',
                is_dependency: false,
                length: 519,
                lines: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
                start: 358,
                starting_column: 5,
              },
              type: 'function',
              type_specific_fields: {
                parent: {
                  name: 'Relayer',
                  source_mapping: {
                    ending_column: 2,
                    filename_absolute:
                      '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
                    filename_relative: 'services/uploads/relayer.sol',
                    filename_short: 'services/uploads/relayer.sol',
                    is_dependency: false,
                    length: 675,
                    lines: [
                      9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                      24, 25, 26, 27, 28, 29, 30,
                    ],
                    start: 204,
                    starting_column: 1,
                  },
                  type: 'contract',
                },
                signature: 'relay(Target,bytes)',
              },
            },
          },
        },
      ],
      metadata: {
        confidence: 'High',
        description:
          'Parameter Relayer.relay(Target,bytes)._data (services/uploads/relayer.sol#19) is not in mixedCase\n',
        duplicated: false,
        first_markdown_element: 'services/uploads/relayer.sol#L19',
        id: 'naming-convention',
        markdown:
          'Parameter [Relayer.relay(Target,bytes)._data](services/uploads/relayer.sol#L19) is not in mixedCase\n',
        severity: 'Informational',
      },
    },
    {
      matches: [
        {
          name: 'relay',
          source_mapping: {
            ending_column: 6,
            filename_absolute:
              '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
            filename_relative: 'services/uploads/relayer.sol',
            filename_short: 'services/uploads/relayer.sol',
            is_dependency: false,
            length: 519,
            lines: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            start: 358,
            starting_column: 5,
          },
          type: 'function',
          type_specific_fields: {
            parent: {
              name: 'Relayer',
              source_mapping: {
                ending_column: 2,
                filename_absolute:
                  '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
                filename_relative: 'services/uploads/relayer.sol',
                filename_short: 'services/uploads/relayer.sol',
                is_dependency: false,
                length: 675,
                lines: [
                  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                  25, 26, 27, 28, 29, 30,
                ],
                start: 204,
                starting_column: 1,
              },
              type: 'contract',
            },
            signature: 'relay(Target,bytes)',
          },
        },
      ],
      metadata: {
        confidence: 'High',
        description:
          'relay(Target,bytes) should be declared external:\n\t- Relayer.relay(Target,bytes) (services/uploads/relayer.sol#19-29)\nMoreover, the following function parameters should change its data location:\n_data location should be calldata\n',
        duplicated: false,
        first_markdown_element: 'services/uploads/relayer.sol#L19-L29',
        id: 'external-function',
        markdown:
          'relay(Target,bytes) should be declared external:\n\t- [Relayer.relay(Target,bytes)](services/uploads/relayer.sol#L19-L29)\nMoreover, the following function parameters should change its data location:\n_data location should be calldata\n',
        severity: 'Optimization',
      },
    },
    {
      matches: [
        {
          name: 'execute',
          source_mapping: {
            ending_column: 6,
            filename_absolute:
              '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
            filename_relative: 'services/uploads/relayer.sol',
            filename_short: 'services/uploads/relayer.sol',
            is_dependency: false,
            length: 84,
            lines: [34, 35, 36],
            start: 933,
            starting_column: 5,
          },
          type: 'function',
          type_specific_fields: {
            parent: {
              name: 'Target',
              source_mapping: {
                ending_column: 2,
                filename_absolute:
                  '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
                filename_relative: 'services/uploads/relayer.sol',
                filename_short: 'services/uploads/relayer.sol',
                is_dependency: false,
                length: 108,
                lines: [33, 34, 35, 36, 37],
                start: 911,
                starting_column: 1,
              },
              type: 'contract',
            },
            signature: 'execute(bytes)',
          },
        },
      ],
      metadata: {
        confidence: 'High',
        description:
          'execute(bytes) should be declared external:\n\t- Target.execute(bytes) (services/uploads/relayer.sol#34-36)\nMoreover, the following function parameters should change its data location:\n_data location should be calldata\n',
        duplicated: false,
        first_markdown_element: 'services/uploads/relayer.sol#L34-L36',
        id: 'external-function',
        markdown:
          'execute(bytes) should be declared external:\n\t- [Target.execute(bytes)](services/uploads/relayer.sol#L34-L36)\nMoreover, the following function parameters should change its data location:\n_data location should be calldata\n',
        severity: 'Optimization',
      },
    },
  ],
  scan_time: 0.6441419124603271,
  success: true,
};

export const SAMPLE_MYTHRIL_RESULT = {
  errors: [],
  findings: [
    {
      matches: [
        {
          address: 966,
          code: 'address(target).call(abi.encodeWithSignature("execute(bytes)", _data))',
          contract: 'Relayer',
          filename: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          function: 'relay(address,bytes)',
          lineno: 27,
          max_gas_used: 124267,
          min_gas_used: 23492,
          sourceMap: '776:70:0',
        },
      ],
      metadata: {
        description:
          'A call to a user-supplied address is executed.\nAn external message call to an address specified by the caller is executed. Note that the callee account might contain arbitrary code and could re-enter any function within this contract. Reentering the contract in an intermediate state may lead to unexpected behaviour. Make sure that no state modifications are executed after this call and/or reentrancy guards are in place.',
        duplicated: false,
        id: 'swc-107',
        'semgrep-id': 'swe-107',
        severity: 'Low',
        title: 'External Call To User-Supplied Address',
      },
    },
    {
      matches: [
        {
          address: 966,
          code: 'address(target).call(abi.encodeWithSignature("execute(bytes)", _data))',
          contract: 'Relayer',
          filename: '/home/jordan/KLTN/tool/services/uploads/relayer.sol',
          function: 'relay(address,bytes)',
          lineno: 27,
          max_gas_used: 124267,
          min_gas_used: 23492,
          sourceMap: '776:70:0',
        },
      ],
      metadata: {
        description:
          "The return value of a message call is not checked.\nExternal calls return a boolean value. If the callee halts with an exception, 'false' is returned and execution continues in the caller. The caller should check whether an exception happened and react accordingly to avoid unexpected behavior. For example it is often desirable to wrap external calls in require() so the transaction is reverted if the call fails.",
        duplicated: true,
        id: 'swc-104',
        'semgrep-id': 'swe-104',
        severity: 'Medium',
        title: 'Unchecked return value from external call.',
      },
    },
  ],
  scan_time: 53.935219526290894,
  success: true,
};
