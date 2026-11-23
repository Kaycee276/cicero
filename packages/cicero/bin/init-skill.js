#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const skillSource = path.join(__dirname, '../skill/cicero.md');
if (!fs.existsSync(skillSource)) {
  console.error('Skill template not found at:', skillSource);
  process.exit(1);
}

const content = fs.readFileSync(skillSource, 'utf-8');
const targetArg = process.argv[2] || '--all';

const destinations = [];

if (targetArg === '--cursor') {
  destinations.push({ dir: '.cursor/rules', file: '.cursor/rules/cicero.mdc' });
} else if (targetArg === '--antigravity') {
  destinations.push({ dir: '.gemini/skills/cicero', file: '.gemini/skills/cicero/SKILL.md' });
} else if (targetArg === '--claude') {
  destinations.push({ dir: '.', file: 'CLAUDE.md' });
} else if (targetArg === '--windsurf') {
  destinations.push({ dir: '.', file: '.windsurfrules' });
} else {
  // Default: install to all popular locations if selected or appropriate
  destinations.push({ dir: '.cursor/rules', file: '.cursor/rules/cicero.mdc' });
  destinations.push({ dir: '.gemini/skills/cicero', file: '.gemini/skills/cicero/SKILL.md' });
  destinations.push({ dir: '.', file: 'CLAUDE.md' });
  destinations.push({ dir: '.', file: '.windsurfrules' });
}

console.log('🛡️  Installing Cicero Zcash Agent Skill...\n');

destinations.forEach(({ dir, file }) => {
  try {
    if (dir !== '.') {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file, content, 'utf-8');
    console.log(` ✓ Installed skill to: ${file}`);
  } catch (err) {
    console.error(` ✗ Failed to install to ${file}:`, err.message);
  }
});

console.log(
  '\n🚀 Cicero Agent Skill successfully installed! Your AI coding assistant is now equipped with shielded Zcash capabilities.'
);
