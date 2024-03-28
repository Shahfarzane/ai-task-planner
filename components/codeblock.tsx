'use client'
import { FC, memo } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { srcery } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
interface Props {
  language: string
  value: string
}

interface languageMap {
  [key: string]: string | undefined
}

export const programmingLanguages: languageMap = {
  javascript: '.js',
  python: '.py',
  java: '.java',
  c: '.c',
  cpp: '.cpp',
  'c++': '.cpp',
  'c#': '.cs',
  ruby: '.rb',
  php: '.php',
  swift: '.swift',
  'objective-c': '.m',
  kotlin: '.kt',
  typescript: '.ts',
  go: '.go',
  perl: '.pl',
  rust: '.rs',
  scala: '.scala',
  haskell: '.hs',
  lua: '.lua',
  shell: '.sh',
  sql: '.sql',
  html: '.html',
  css: '.css'
}

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXY3456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return lowercase ? result.toLowerCase() : result
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const downloadAsFile = () => {
    if (typeof window === 'undefined') {
      return
    }
    const fileExtension = programmingLanguages[language] || '.file'
    const suggestedFileName = `file-${generateRandomString(
      3,
      true
    )}${fileExtension}`
    const fileName = window.prompt('Enter file name' || '', suggestedFileName)

    if (!fileName) {
      return
    }

    const blob = new Blob([value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = fileName
    link.href = url
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(value)
  }

  return (
    <div className="relative  w-full rounded-lg bg-n-6 border border-n-5 dark:bg-n-7 codeblock">
      <div className="flex justify-between bg-n-7 rounded-t-xl shadow-[inset_0_-0.0625rem_0_0_#393E44]">
        <div className="flex items-center h-12 px-5 text-base-2 text-n-1">
          {language}
        </div>
        <div className="flex items-center space-x-1">
          <button
            className="group flex items-center h-12  px-2 text-base-2 font-semibold text-n-1 transition-colors hover:text-primary-4"
            onClick={downloadAsFile}
          ></button>

          <a onClick={onCopy}>
            {isCopied ? (
              <div className="flex items-center px-5 text-base-2 font-semibold text-n-1">
                Copied!
              </div>
            ) : (
              <button className="group flex items-center h-12 ml-auto px-2 text-base-2 font-semibold text-n-1 transition-colors hover:text-primary-4">
                <span>Copy</span>
              </button>
            )}
          </a>
        </div>
      </div>
      <div className="max-h-[26.5rem] overflow-auto rounded-b-xl ">
        <SyntaxHighlighter
          language={language}
          showLineNumbers
          PreTag="div"
          style={srcery}
          customStyle={{
            maxWidth: '100%',
            padding: '1rem 1rem 1.5rem'
          }}
          lineNumberStyle={{
            textAlign: 'left',
            color: '#7A7C7C'
          }}
          codeTagProps={{
            style: {
              fontSize: '0.9rem'
            }
          }}
        >
          {value || ''}
        </SyntaxHighlighter>
      </div>
    </div>
  )
})

CodeBlock.displayName = 'CodeBlock'

export { CodeBlock }
