import { env } from "@/config/environment";

export const BASE_URL =
  env.NODE_ENV === "development"
    ? `${env.LOCAL_API_URL}:${env.LOCAL_API_PORT}`
    : env.API_URL;

export const SAMPLE_RESULT = {
  semantic_grep: {
    errors: [],
    findings: [
      {
        matches: [
          {
            file_path: "services/uploads/odd_even.sol",
            match_position: [9, 16],
            match_lines: [22, 22],
            match_string: "        count++;",
          },
          {
            file_path: "services/uploads/odd_even.sol",
            match_position: [18, 45],
            match_lines: [27, 27],
            match_string:
              "        uint n = players[0].number + players[1].number;",
          },
          {
            file_path: "services/uploads/odd_even.sol",
            match_position: [36, 39],
            match_lines: [28, 28],
            match_string:
              '        (bool success, ) = players[n%2].addr.call.value(address(this).balance)("");',
          },
        ],
        metadata: {
          cwe: "CWE-682: Incorrect Calculation",
          references: [
            "https://swcregistry.io/docs/SWC-101/",
            "https://docs.soliditylang.org/en/latest/types.html",
            "https://ethereum.stackexchange.com/questions/96482/can-division-underflow-or-overflow-in-solidity",
          ],
          description:
            "The operation on variable `count` could lead to overflow/underflow.",
          severity: "WARNING",
          id: "swe-101",
        },
      },
      {
        matches: [
          {
            file_path: "services/uploads/odd_even.sol",
            match_position: [10, 17],
            match_lines: [9, 9],
            match_string: "contract OddEven {",
          },
        ],
        metadata: {
          category: "security",
          cwe: "CWE-665: Improper Initialization",
          references: [
            "https://swcregistry.io/docs/SWC-118/#incorrect_constructor_name1sol",
            "https://cwe.mitre.org/data/definitions/665.html",
          ],
          description:
            "The absence of an explicitly defined constructor in smart contract `OddEven` will result in the automatic generation of a default constructor with the code `constructor() {}`. This can occur due to either a constructor name that doesn't match the contract name `OddEven` or an incorrectly formatted constructor declaration.",
          severity: "WARNING",
          id: "swe-118",
        },
      },
      {
        matches: [
          {
            file_path: "services/uploads/odd_even.sol",
            match_position: [1, 23],
            match_lines: [7, 7],
            match_string: "pragma solidity ^0.5.0;",
          },
        ],
        metadata: {
          category: "security",
          cwe: "CWE-664: Improper Control of a Resource Through its Lifetime",
          references: [
            "https://swcregistry.io/docs/SWC-103/",
            "https://cwe.mitre.org/data/definitions/664.html",
            "https://semgrep.dev/docs/kb/rules/match-absence",
          ],
          description:
            "Contracts should be deployed with the same compiler version and flags that they have been tested with thoroughly. Locking the pragma helps to ensure that contracts do not accidentally get deployed using, for example, an outdated compiler version that might introduce bugs that affect the contract system negatively.",
          severity: "WARNING",
          id: "swe-103",
        },
      },
      {
        matches: [
          {
            file_path: "services/uploads/odd_even.sol",
            match_position: [5, 30],
            match_lines: [16, 16],
            match_string: "    Player[2] private players;",
          },
        ],
        metadata: {
          category: "security",
          cwe: "CWE-767: Access to Critical Private Variable via Public Method",
          references: [
            "https://swcregistry.io/docs/SWC-136/",
            "https://cwe.mitre.org/data/definitions/767.html",
          ],
          description:
            "Be careful when using `players` with a private type to store private data in a smart contract. Any private data should either be stored off-chain, or carefully encrypted.",
          severity: "WARNING",
          id: "swe-136",
        },
      },
      {
        matches: [
          {
            file_path: "services/uploads/odd_even.sol",
            match_position: [5, 30],
            match_lines: [16, 16],
            match_string: "    Player[2] private players;",
          },
          {
            file_path: "services/uploads/odd_even.sol",
            match_position: [5, 19],
            match_lines: [17, 17],
            match_string: "    uint count = 0;",
          },
        ],
        metadata: {
          cwe: "CWE-710: Improper Adherence to Coding Standards",
          references: [
            "https://swcregistry.io/docs/SWC-108/",
            "https://docs.soliditylang.org/en/latest/types.html",
          ],
          description:
            "Labeling the visibility for `players` makes it easier to catch incorrect assumptions about who can access the variable.",
          severity: "WARNING",
          id: "swe-108",
        },
      },
    ],
    scan_time: 1.002866,
    success: true,
  },
  slither: {
    errors: [],
    findings: [
      {
        matches: [
          {
            type: "function",
            name: "selectWinner",
            source_mapping: {
              start: 603,
              length: 267,
              filename_relative: "services/uploads/odd_even.sol",
              filename_absolute:
                "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
              filename_short: "services/uploads/odd_even.sol",
              is_dependency: false,
              lines: [26, 27, 28, 29, 30, 31, 32],
              starting_column: 5,
              ending_column: 6,
            },
            type_specific_fields: {
              parent: {
                type: "contract",
                name: "OddEven",
                source_mapping: {
                  start: 205,
                  length: 667,
                  filename_relative: "services/uploads/odd_even.sol",
                  filename_absolute:
                    "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                  filename_short: "services/uploads/odd_even.sol",
                  is_dependency: false,
                  lines: [
                    9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                  ],
                  starting_column: 1,
                  ending_column: 0,
                },
              },
              signature: "selectWinner()",
            },
          },
          {
            type: "node",
            name: "(success) = players[n % 2].addr.call.value(address(this).balance)()",
            source_mapping: {
              start: 701,
              length: 74,
              filename_relative: "services/uploads/odd_even.sol",
              filename_absolute:
                "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
              filename_short: "services/uploads/odd_even.sol",
              is_dependency: false,
              lines: [28],
              starting_column: 9,
              ending_column: 83,
            },
            type_specific_fields: {
              parent: {
                type: "function",
                name: "selectWinner",
                source_mapping: {
                  start: 603,
                  length: 267,
                  filename_relative: "services/uploads/odd_even.sol",
                  filename_absolute:
                    "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                  filename_short: "services/uploads/odd_even.sol",
                  is_dependency: false,
                  lines: [26, 27, 28, 29, 30, 31, 32],
                  starting_column: 5,
                  ending_column: 6,
                },
                type_specific_fields: {
                  parent: {
                    type: "contract",
                    name: "OddEven",
                    source_mapping: {
                      start: 205,
                      length: 667,
                      filename_relative: "services/uploads/odd_even.sol",
                      filename_absolute:
                        "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                      filename_short: "services/uploads/odd_even.sol",
                      is_dependency: false,
                      lines: [
                        9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
                        23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                      ],
                      starting_column: 1,
                      ending_column: 0,
                    },
                  },
                  signature: "selectWinner()",
                },
              },
            },
            additional_fields: {
              underlying_type: "external_calls",
            },
          },
          {
            type: "node",
            name: "delete players",
            source_mapping: {
              start: 830,
              length: 14,
              filename_relative: "services/uploads/odd_even.sol",
              filename_absolute:
                "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
              filename_short: "services/uploads/odd_even.sol",
              is_dependency: false,
              lines: [30],
              starting_column: 9,
              ending_column: 23,
            },
            type_specific_fields: {
              parent: {
                type: "function",
                name: "selectWinner",
                source_mapping: {
                  start: 603,
                  length: 267,
                  filename_relative: "services/uploads/odd_even.sol",
                  filename_absolute:
                    "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                  filename_short: "services/uploads/odd_even.sol",
                  is_dependency: false,
                  lines: [26, 27, 28, 29, 30, 31, 32],
                  starting_column: 5,
                  ending_column: 6,
                },
                type_specific_fields: {
                  parent: {
                    type: "contract",
                    name: "OddEven",
                    source_mapping: {
                      start: 205,
                      length: 667,
                      filename_relative: "services/uploads/odd_even.sol",
                      filename_absolute:
                        "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                      filename_short: "services/uploads/odd_even.sol",
                      is_dependency: false,
                      lines: [
                        9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
                        23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                      ],
                      starting_column: 1,
                      ending_column: 0,
                    },
                  },
                  signature: "selectWinner()",
                },
              },
            },
            additional_fields: {
              underlying_type: "variables_written",
              variable_name: "players",
            },
          },
        ],
        metadata: {
          description:
            "Reentrancy in OddEven.selectWinner() (services/uploads/odd_even.sol#26-32):\n\tExternal calls:\n\t- (success) = players[n % 2].addr.call.value(address(this).balance)() (services/uploads/odd_even.sol#28)\n\tState variables written after the call(s):\n\t- delete players (services/uploads/odd_even.sol#30)\n\tOddEven.players (services/uploads/odd_even.sol#16) can be used in cross function reentrancies:\n\t- OddEven.play(uint256) (services/uploads/odd_even.sol#19-24)\n\t- OddEven.selectWinner() (services/uploads/odd_even.sol#26-32)\n",
          id: "reentrancy-eth",
          severity: "High",
          markdown:
            "Reentrancy in [OddEven.selectWinner()](services/uploads/odd_even.sol#L26-L32):\n\tExternal calls:\n\t- [(success) = players[n % 2].addr.call.value(address(this).balance)()](services/uploads/odd_even.sol#L28)\n\tState variables written after the call(s):\n\t- [delete players](services/uploads/odd_even.sol#L30)\n\t[OddEven.players](services/uploads/odd_even.sol#L16) can be used in cross function reentrancies:\n\t- [OddEven.play(uint256)](services/uploads/odd_even.sol#L19-L24)\n\t- [OddEven.selectWinner()](services/uploads/odd_even.sol#L26-L32)\n",
          first_markdown_element: "services/uploads/odd_even.sol#L26-L32",
          confidence: "Medium",
          "semgrep-id": "swe-107",
          duplicated: false,
        },
      },
      {
        matches: [
          {
            type: "function",
            name: "selectWinner",
            source_mapping: {
              start: 603,
              length: 267,
              filename_relative: "services/uploads/odd_even.sol",
              filename_absolute:
                "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
              filename_short: "services/uploads/odd_even.sol",
              is_dependency: false,
              lines: [26, 27, 28, 29, 30, 31, 32],
              starting_column: 5,
              ending_column: 6,
            },
            type_specific_fields: {
              parent: {
                type: "contract",
                name: "OddEven",
                source_mapping: {
                  start: 205,
                  length: 667,
                  filename_relative: "services/uploads/odd_even.sol",
                  filename_absolute:
                    "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                  filename_short: "services/uploads/odd_even.sol",
                  is_dependency: false,
                  lines: [
                    9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                  ],
                  starting_column: 1,
                  ending_column: 0,
                },
              },
              signature: "selectWinner()",
            },
          },
          {
            type: "node",
            name: "(success) = players[n % 2].addr.call.value(address(this).balance)()",
            source_mapping: {
              start: 701,
              length: 74,
              filename_relative: "services/uploads/odd_even.sol",
              filename_absolute:
                "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
              filename_short: "services/uploads/odd_even.sol",
              is_dependency: false,
              lines: [28],
              starting_column: 9,
              ending_column: 83,
            },
            type_specific_fields: {
              parent: {
                type: "function",
                name: "selectWinner",
                source_mapping: {
                  start: 603,
                  length: 267,
                  filename_relative: "services/uploads/odd_even.sol",
                  filename_absolute:
                    "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                  filename_short: "services/uploads/odd_even.sol",
                  is_dependency: false,
                  lines: [26, 27, 28, 29, 30, 31, 32],
                  starting_column: 5,
                  ending_column: 6,
                },
                type_specific_fields: {
                  parent: {
                    type: "contract",
                    name: "OddEven",
                    source_mapping: {
                      start: 205,
                      length: 667,
                      filename_relative: "services/uploads/odd_even.sol",
                      filename_absolute:
                        "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                      filename_short: "services/uploads/odd_even.sol",
                      is_dependency: false,
                      lines: [
                        9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
                        23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                      ],
                      starting_column: 1,
                      ending_column: 0,
                    },
                  },
                  signature: "selectWinner()",
                },
              },
            },
            additional_fields: {
              underlying_type: "external_calls",
            },
          },
          {
            type: "node",
            name: "count = 0",
            source_mapping: {
              start: 854,
              length: 9,
              filename_relative: "services/uploads/odd_even.sol",
              filename_absolute:
                "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
              filename_short: "services/uploads/odd_even.sol",
              is_dependency: false,
              lines: [31],
              starting_column: 9,
              ending_column: 18,
            },
            type_specific_fields: {
              parent: {
                type: "function",
                name: "selectWinner",
                source_mapping: {
                  start: 603,
                  length: 267,
                  filename_relative: "services/uploads/odd_even.sol",
                  filename_absolute:
                    "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                  filename_short: "services/uploads/odd_even.sol",
                  is_dependency: false,
                  lines: [26, 27, 28, 29, 30, 31, 32],
                  starting_column: 5,
                  ending_column: 6,
                },
                type_specific_fields: {
                  parent: {
                    type: "contract",
                    name: "OddEven",
                    source_mapping: {
                      start: 205,
                      length: 667,
                      filename_relative: "services/uploads/odd_even.sol",
                      filename_absolute:
                        "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                      filename_short: "services/uploads/odd_even.sol",
                      is_dependency: false,
                      lines: [
                        9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
                        23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                      ],
                      starting_column: 1,
                      ending_column: 0,
                    },
                  },
                  signature: "selectWinner()",
                },
              },
            },
            additional_fields: {
              underlying_type: "variables_written",
              variable_name: "count",
            },
          },
        ],
        metadata: {
          description:
            "Reentrancy in OddEven.selectWinner() (services/uploads/odd_even.sol#26-32):\n\tExternal calls:\n\t- (success) = players[n % 2].addr.call.value(address(this).balance)() (services/uploads/odd_even.sol#28)\n\tState variables written after the call(s):\n\t- count = 0 (services/uploads/odd_even.sol#31)\n",
          id: "reentrancy-benign",
          severity: "Low",
          markdown:
            "Reentrancy in [OddEven.selectWinner()](services/uploads/odd_even.sol#L26-L32):\n\tExternal calls:\n\t- [(success) = players[n % 2].addr.call.value(address(this).balance)()](services/uploads/odd_even.sol#L28)\n\tState variables written after the call(s):\n\t- [count = 0](services/uploads/odd_even.sol#L31)\n",
          first_markdown_element: "services/uploads/odd_even.sol#L26-L32",
          confidence: "Medium",
        },
      },
      {
        matches: [],
        metadata: {
          description: "solc-0.5.0 is not recommended for deployment\n",
          id: "solc-version",
          severity: "Informational",
          markdown: "solc-0.5.0 is not recommended for deployment\n",
          first_markdown_element: "",
          confidence: "High",
        },
      },
      {
        matches: [
          {
            type: "pragma",
            name: "^0.5.0",
            source_mapping: {
              start: 180,
              length: 23,
              filename_relative: "services/uploads/odd_even.sol",
              filename_absolute:
                "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
              filename_short: "services/uploads/odd_even.sol",
              is_dependency: false,
              lines: [7],
              starting_column: 1,
              ending_column: 24,
            },
            type_specific_fields: {
              directive: ["solidity", "^", "0.5", ".0"],
            },
          },
        ],
        metadata: {
          description:
            "Pragma version^0.5.0 (services/uploads/odd_even.sol#7) allows old versions\n",
          id: "solc-version",
          severity: "Informational",
          markdown:
            "Pragma version[^0.5.0](services/uploads/odd_even.sol#L7) allows old versions\n",
          first_markdown_element: "services/uploads/odd_even.sol#L7",
          confidence: "High",
        },
      },
      {
        matches: [
          {
            type: "function",
            name: "selectWinner",
            source_mapping: {
              start: 603,
              length: 267,
              filename_relative: "services/uploads/odd_even.sol",
              filename_absolute:
                "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
              filename_short: "services/uploads/odd_even.sol",
              is_dependency: false,
              lines: [26, 27, 28, 29, 30, 31, 32],
              starting_column: 5,
              ending_column: 6,
            },
            type_specific_fields: {
              parent: {
                type: "contract",
                name: "OddEven",
                source_mapping: {
                  start: 205,
                  length: 667,
                  filename_relative: "services/uploads/odd_even.sol",
                  filename_absolute:
                    "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                  filename_short: "services/uploads/odd_even.sol",
                  is_dependency: false,
                  lines: [
                    9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                  ],
                  starting_column: 1,
                  ending_column: 0,
                },
              },
              signature: "selectWinner()",
            },
          },
          {
            type: "node",
            name: "(success) = players[n % 2].addr.call.value(address(this).balance)()",
            source_mapping: {
              start: 701,
              length: 74,
              filename_relative: "services/uploads/odd_even.sol",
              filename_absolute:
                "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
              filename_short: "services/uploads/odd_even.sol",
              is_dependency: false,
              lines: [28],
              starting_column: 9,
              ending_column: 83,
            },
            type_specific_fields: {
              parent: {
                type: "function",
                name: "selectWinner",
                source_mapping: {
                  start: 603,
                  length: 267,
                  filename_relative: "services/uploads/odd_even.sol",
                  filename_absolute:
                    "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                  filename_short: "services/uploads/odd_even.sol",
                  is_dependency: false,
                  lines: [26, 27, 28, 29, 30, 31, 32],
                  starting_column: 5,
                  ending_column: 6,
                },
                type_specific_fields: {
                  parent: {
                    type: "contract",
                    name: "OddEven",
                    source_mapping: {
                      start: 205,
                      length: 667,
                      filename_relative: "services/uploads/odd_even.sol",
                      filename_absolute:
                        "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
                      filename_short: "services/uploads/odd_even.sol",
                      is_dependency: false,
                      lines: [
                        9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
                        23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                      ],
                      starting_column: 1,
                      ending_column: 0,
                    },
                  },
                  signature: "selectWinner()",
                },
              },
            },
          },
        ],
        metadata: {
          description:
            "Low level call in OddEven.selectWinner() (services/uploads/odd_even.sol#26-32):\n\t- (success) = players[n % 2].addr.call.value(address(this).balance)() (services/uploads/odd_even.sol#28)\n",
          id: "low-level-calls",
          severity: "Informational",
          markdown:
            "Low level call in [OddEven.selectWinner()](services/uploads/odd_even.sol#L26-L32):\n\t- [(success) = players[n % 2].addr.call.value(address(this).balance)()](services/uploads/odd_even.sol#L28)\n",
          first_markdown_element: "services/uploads/odd_even.sol#L26-L32",
          confidence: "High",
        },
      },
    ],
    scan_time: 0.617578,
    success: true,
  },
  mythril: {
    errors: [],
    findings: [
      {
        matches: [
          {
            address: 481,
            code: "players[0].number + players[1].number",
            contract: "OddEven",
            filename:
              "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
            function: "play(uint256)",
            lineno: 27,
            max_gas_used: 246227,
            min_gas_used: 49779,
            sourceMap: ":37",
          },
        ],
        metadata: {
          description:
            "The arithmetic operator can overflow.\nIt is possible to cause an integer overflow or underflow in the arithmetic operation. ",
          severity: "High",
          id: "swc-101",
          title: "Integer Arithmetic Bugs",
          "semgrep-id": "swe-101",
          duplicated: true,
        },
      },
      {
        matches: [
          {
            address: 619,
            code: 'players[n%2].addr.call.value(address(this).balance)("")',
            contract: "OddEven",
            filename:
              "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
            function: "play(uint256)",
            lineno: 28,
            max_gas_used: 246227,
            min_gas_used: 49779,
            sourceMap: "720:55",
          },
        ],
        metadata: {
          description:
            "A call to a user-supplied address is executed.\nAn external message call to an address specified by the caller is executed. Note that the callee account might contain arbitrary code and could re-enter any function within this contract. Reentering the contract in an intermediate state may lead to unexpected behaviour. Make sure that no state modifications are executed after this call and/or reentrancy guards are in place.",
          severity: "Low",
          id: "swc-107",
          title: "External Call To User-Supplied Address",
          "semgrep-id": "swe-107",
        },
      },
      {
        matches: [
          {
            address: 619,
            code: 'players[n%2].addr.call.value(address(this).balance)("")',
            contract: "OddEven",
            filename:
              "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
            function: "play(uint256)",
            lineno: 28,
            max_gas_used: 246227,
            min_gas_used: 49779,
            sourceMap: "720:55",
          },
        ],
        metadata: {
          description:
            "Any sender can withdraw Ether from the contract account.\nArbitrary senders other than the contract creator can profitably extract Ether from the contract account. Verify the business logic carefully and make sure that appropriate security controls are in place to prevent unexpected loss of funds.",
          severity: "High",
          id: "swc-105",
          title: "Unprotected Ether Withdrawal",
          "semgrep-id": "swe-105",
        },
      },
      {
        matches: [
          {
            address: 813,
            code: "count = 0",
            contract: "OddEven",
            filename:
              "/home/aleister/Workspaces/thesis/tool/services/uploads/odd_even.sol",
            function: "play(uint256)",
            lineno: 31,
            max_gas_used: 246227,
            min_gas_used: 49779,
            sourceMap: ":9",
          },
        ],
        metadata: {
          description:
            "Write to persistent state following external call\nThe contract account state is accessed after an external call to a user defined address. To prevent reentrancy issues, consider accessing the state only before the call, especially if the callee is untrusted. Alternatively, a reentrancy lock can be used to prevent untrusted callees from re-entering the contract in an intermediate state.",
          severity: "Medium",
          id: "swc-107",
          title: "State access after external call",
          "semgrep-id": "swe-107",
        },
      },
      {
        matches: [
          {
            address: 832,
            contract: "OddEven",
            function: "play(uint256)",
            max_gas_used: 246227,
            min_gas_used: 49779,
            sourceMap: "205:667::-",
          },
          {
            address: 884,
            contract: "OddEven",
            function: "play(uint256)",
            max_gas_used: 246227,
            min_gas_used: 49779,
            sourceMap: "205:667::-",
          },
        ],
        metadata: {
          description:
            "Read of persistent state following external call\nThe contract account state is accessed after an external call to a user defined address. To prevent reentrancy issues, consider accessing the state only before the call, especially if the callee is untrusted. Alternatively, a reentrancy lock can be used to prevent untrusted callees from re-entering the contract in an intermediate state. This issue is reported for internal compiler generated code.",
          severity: "Low",
          id: "swc-107",
          title: "State access after external call",
          "semgrep-id": "swe-107",
        },
      },
      {
        matches: [
          {
            address: 859,
            contract: "OddEven",
            function: "play(uint256)",
            max_gas_used: 246227,
            min_gas_used: 49779,
            sourceMap: "205:667::-",
          },
          {
            address: 867,
            contract: "OddEven",
            function: "play(uint256)",
            max_gas_used: 246227,
            min_gas_used: 49779,
            sourceMap: "205:667::-",
          },
          {
            address: 911,
            contract: "OddEven",
            function: "play(uint256)",
            max_gas_used: 246227,
            min_gas_used: 49779,
            sourceMap: "205:667::-",
          },
          {
            address: 919,
            contract: "OddEven",
            function: "play(uint256)",
            max_gas_used: 246227,
            min_gas_used: 49779,
            sourceMap: "205:667::-",
          },
        ],
        metadata: {
          description:
            "Write to persistent state following external call\nThe contract account state is accessed after an external call to a user defined address. To prevent reentrancy issues, consider accessing the state only before the call, especially if the callee is untrusted. Alternatively, a reentrancy lock can be used to prevent untrusted callees from re-entering the contract in an intermediate state. This issue is reported for internal compiler generated code.",
          severity: "Low",
          id: "swc-107",
          title: "State access after external call",
          "semgrep-id": "swe-107",
        },
      },
    ],
    scan_time: 10.936079,
    success: true,
  },
  full_coverage: false,
  scan_time: 12.556523,
};
