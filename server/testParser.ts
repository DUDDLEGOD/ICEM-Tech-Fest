import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sanitizeJsonBlock = (block: string) => {
  let result = '';
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < block.length; index += 1) {
    const character = block[index];

    if (inString && character === '\r') {
      if (block[index + 1] === '\n') {
        index += 1;
      }
      result += '\\n';
      isEscaped = false;
      continue;
    }

    if (inString && character === '\n') {
      result += '\\n';
      isEscaped = false;
      continue;
    }

    result += character;

    if (character === '"' && !isEscaped) {
      inString = !inString;
    }

    if (character === '\\' && !isEscaped) {
      isEscaped = true;
    } else {
      isEscaped = false;
    }
  }

  return result;
};

const parseJsonBlock = (markdown: string, blockName: string) => {
  const pattern = new RegExp(
    '^```json\\s+' + escapeRegex(blockName) + '\\s*$\\r?\\n([\\s\\S]*?)\\r?\\n^```',
    'm',
  );
  const match = markdown.match(pattern);

  if (!match) {
    console.log(`NO MATCH FOR: ${blockName}`);
    return undefined;
  }

  try {
    const sanitized = sanitizeJsonBlock(match[1]);
    return JSON.parse(sanitized);
  } catch (error) {
    console.error(`SYNTAX ERROR IN ${blockName}:`, error.message);
    throw error;
  }
};

const mdPath = path.join(__dirname, '../content/site-config.md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

console.log("Testing parse...");
parseJsonBlock(mdContent, 'hero');
parseJsonBlock(mdContent, 'registration');
parseJsonBlock(mdContent, 'events');
console.log("Done.");
