#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import solc from 'solc'

// Function to compile the Solidity contract
function compileContract() {
  console.log('📝 Compiling MyERC20 contract...')
  
  // Read the contract source code
  const contractPath = path.join(process.cwd(), 'contracts', 'MyERC20.sol')
  const sourceCode = fs.readFileSync(contractPath, 'utf8')
  
  // Setup solidity compiler input
  const input = {
    language: 'Solidity',
    sources: {
      'MyERC20.sol': {
        content: sourceCode
      },
      '@openzeppelin/contracts/token/ERC20/ERC20.sol': {
        content: fs.readFileSync(
          path.join(process.cwd(), 'node_modules', '@openzeppelin', 'contracts', 'token', 'ERC20', 'ERC20.sol'), 
          'utf8'
        )
      },
      '@openzeppelin/contracts/token/ERC20/IERC20.sol': {
        content: fs.readFileSync(
          path.join(process.cwd(), 'node_modules', '@openzeppelin', 'contracts', 'token', 'ERC20', 'IERC20.sol'), 
          'utf8'
        )
      },
      '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol': {
        content: fs.readFileSync(
          path.join(process.cwd(), 'node_modules', '@openzeppelin', 'contracts', 'token', 'ERC20', 'extensions', 'IERC20Metadata.sol'), 
          'utf8'
        )
      },
      '@openzeppelin/contracts/utils/Context.sol': {
        content: fs.readFileSync(
          path.join(process.cwd(), 'node_modules', '@openzeppelin', 'contracts', 'utils', 'Context.sol'), 
          'utf8'
        )
      },
      '@openzeppelin/contracts/interfaces/draft-IERC6093.sol': {
        content: fs.readFileSync(
          path.join(process.cwd(), 'node_modules', '@openzeppelin', 'contracts', 'interfaces', 'draft-IERC6093.sol'), 
          'utf8'
        )
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      },
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
  
  // Compile the contract
  const output = JSON.parse(solc.compile(JSON.stringify(input)))
  
  // Check for compilation errors
  if (output.errors) {
    output.errors.forEach(error => {
      if (error.severity === 'error') {
        console.error('❌ Compilation error:', error.formattedMessage)
        process.exit(1)
      } else {
        console.warn('⚠️ Compilation warning:', error.formattedMessage)
      }
    })
  }
  
  const contract = output.contracts['MyERC20.sol']['MyERC20']
  
  if (!contract) {
    console.error('❌ Contract not found in compilation output')
    process.exit(1)
  }
  
  console.log('✅ Contract compiled successfully!')
  
  return {
    abi: contract.abi,
    bytecode: '0x' + contract.evm.bytecode.object
  }
}

// Update the artifacts file with new contract data
function updateArtifacts(compiledContract) {
  console.log('📝 Updating contract artifacts...')
  
  const artifactsPath = path.join(process.cwd(), 'src', 'contracts', 'MyERC20Artifacts.ts')
  
  const artifactsContent = `// MyERC20 Contract Artifacts
// UPDATED - ${new Date().toISOString()}
// Solidity 0.8.30 with optimization runs=200

export const MY_ERC20_ABI = ${JSON.stringify(compiledContract.abi, null, 2)} as const

export const MY_ERC20_BYTECODE = "${compiledContract.bytecode}"

export const FEE_AMOUNT = "20000000000000000" // 0.02 ETH in wei
export const FEE_RECIPIENT = "0x160788647f13271dF554aA3640025CA1560ecdE8"
`
  
  fs.writeFileSync(artifactsPath, artifactsContent, 'utf8')
  console.log('✅ Contract artifacts updated successfully!')
}

// Main deployment function
function main() {
  try {
    console.log('🚀 Starting MyERC20 contract compilation and artifact update...')
    
    // Compile contract
    const compiledContract = compileContract()
    
    // Update artifacts
    updateArtifacts(compiledContract)
    
    console.log('\n✅ Deployment preparation complete!')
    console.log('📝 Updated contract artifacts with:')
    console.log('   - New bytecode with 0.02 ETH fee')
    console.log('   - Updated FEE_AMOUNT constant (20000000000000000 wei)')
    console.log('   - Latest ABI from compiled contract')
    console.log('\n🎯 The frontend will now use the correct 0.02 ETH fee!')
    
  } catch (error) {
    console.error('❌ Deployment failed:', error)
    process.exit(1)
  }
}

// Run the script
main()