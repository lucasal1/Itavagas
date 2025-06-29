const { execSync } = require('child_process');

function runCommand(command) {
  try {
    console.log(`Executando: ${command}`);
    const output = execSync(command, { encoding: 'utf-8', stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`Erro ao executar comando: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function deployToGitHub() {
  console.log('🚀 Iniciando deploy para GitHub...\n');

  // Verificar se estamos em um repositório Git
  try {
    execSync('git status', { encoding: 'utf-8' });
  } catch (error) {
    console.log('📁 Inicializando repositório Git...');
    runCommand('git init');
  }

  // Adicionar todos os arquivos
  console.log('📦 Adicionando arquivos...');
  runCommand('git add .');

  // Fazer commit com timestamp
  const timestamp = new Date().toLocaleString('pt-BR');
  const commitMessage = `Atualização do código - ${timestamp}`;
  console.log(`💾 Fazendo commit: ${commitMessage}`);
  runCommand(`git commit -m "${commitMessage}"`);

  // Verificar se existe um remote origin
  try {
    execSync('git remote get-url origin', { encoding: 'utf-8' });
    console.log('🔗 Remote origin já configurado');
  } catch (error) {
    console.log('⚠️  Remote origin não configurado');
    console.log('Para configurar, execute:');
    console.log('git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git');
    console.log('\nOu se já existe o repositório:');
    console.log('git remote add origin https://github.com/SEU_USUARIO/itavagas-app.git');
    return;
  }

  // Push para o GitHub
  console.log('🚀 Enviando para GitHub...');
  try {
    runCommand('git push origin main');
  } catch (error) {
    console.log('Tentando push para branch master...');
    try {
      runCommand('git push origin master');
    } catch (error2) {
      console.log('Tentando push com --set-upstream...');
      runCommand('git push --set-upstream origin main');
    }
  }

  console.log('✅ Deploy concluído com sucesso!');
}

deployToGitHub();