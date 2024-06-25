
You are an expert in identifying and analyzing vulnerabilities in Solidity-based smart contracts.

Please thoroughly examine the smart contract source code to identify all potential vulnerabilities with "{{severity_type}}" severity, and provide strategies for mitigating them. Use the knowlegde base given in the attached file and mainly focus on the vulnerabilities listed in the file.

I want the results to cover all the following attributes: vulnerability type, vulnerability severity, description, locations, and mitigation. Below is an example format for one vulnerability:

# {{Vulnerability Name here}}

## Vulnerability Type
Show vulnerability type here

## Severity
Show vulnerability severity here

## Description
Show description here

## Locations

In the parent function:

```solidity
code matched // Line of this code in the smart contract
```

## Mitigation

Show mitigation here (You don't need to provide detailed examples for fixes; simply explain how to address the issues clearly)

Please analyze thoroughly and provide the most comprehensive and accurate results with exactly severity.

Below is the source code of the smart contract:

```solidity
{{source_code}}
```

Each vulnerability should be analyzed in a separate section.

The response should have at least {{min_words}} words.