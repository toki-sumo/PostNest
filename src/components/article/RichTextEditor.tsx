'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Typography from '@tiptap/extension-typography';
import { useState } from 'react';

type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
};

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      TextStyle,
      Color,
      Typography,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const toggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  const toggleStrike = () => {
    editor.chain().focus().toggleStrike().run();
  };

  const toggleCode = () => {
    editor.chain().focus().toggleCode().run();
  };

  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  const toggleBlockquote = () => {
    editor.chain().focus().toggleBlockquote().run();
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  return (
    <div className="space-y-4">
      {/* ツールバー */}
      <div className="border border-slate-200 rounded-lg bg-white">
        <div className="border-b border-slate-200 p-3 bg-slate-50">
          <div className="flex flex-wrap items-center gap-2">
            {/* プレビュートグル */}
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                showPreview
                  ? 'bg-slate-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {showPreview ? '編集モード' : 'プレビュー'}
            </button>

            {/* 見出し */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => toggleHeading(1)}
                className={`px-2 py-1 text-xs rounded ${
                  editor.isActive('heading', { level: 1 })
                    ? 'bg-slate-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                } transition-colors duration-200`}
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => toggleHeading(2)}
                className={`px-2 py-1 text-xs rounded ${
                  editor.isActive('heading', { level: 2 })
                    ? 'bg-slate-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                } transition-colors duration-200`}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => toggleHeading(3)}
                className={`px-2 py-1 text-xs rounded ${
                  editor.isActive('heading', { level: 3 })
                    ? 'bg-slate-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                } transition-colors duration-200`}
              >
                H3
              </button>
            </div>

            {/* テキスト装飾 */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleBold}
                className={`p-2 rounded ${
                  editor.isActive('bold')
                    ? 'bg-slate-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                } transition-colors duration-200`}
                title="太字"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.6 11.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 7.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={toggleItalic}
                className={`p-2 rounded ${
                  editor.isActive('italic')
                    ? 'bg-slate-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                } transition-colors duration-200`}
                title="斜体"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={toggleStrike}
                className={`p-2 rounded ${
                  editor.isActive('strike')
                    ? 'bg-slate-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                } transition-colors duration-200`}
                title="取り消し線"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.24 8.75c-.25-.33-.44-.7-.56-1.12-.12-.42-.18-.87-.18-1.35 0-.48.06-.93.18-1.35.12-.42.31-.79.56-1.12.25-.33.55-.61.9-.84.35-.23.74-.41 1.17-.53.43-.12.89-.18 1.37-.18.48 0 .94.06 1.37.18.43.12.82.3 1.17.53.35.23.65.51.9.84.25.33.44.7.56 1.12.12.42.18.87.18 1.35 0 .48-.06.93-.18 1.35-.12.42-.31.79-.56 1.12-.25.33-.55.61-.9.84-.35.23-.74.41-1.17.53-.43.12-.89.18-1.37.18-.48 0-.94-.06-1.37-.18-.43-.12-.82-.3-1.17-.53-.35-.23-.65-.51-.9-.84zM13.5 15.5c-.48 0-.94-.06-1.37-.18-.43-.12-.82-.3-1.17-.53-.35-.23-.65-.51-.9-.84-.25-.33-.44-.7-.56-1.12-.12-.42-.18-.87-.18-1.35 0-.48.06-.93.18-1.35.12-.42.31-.79.56-1.12.25-.33.55-.61.9-.84.35-.23.74-.41 1.17-.53.43-.12.89-.18 1.37-.18.48 0 .94.06 1.37.18.43.12.82.3 1.17.53.35.23.65.51.9.84.25.33.44.7.56 1.12.12.42.18.87.18 1.35 0 .48-.06.93-.18 1.35-.12.42-.31.79-.56 1.12-.25.33-.55.61-.9.84-.35.23-.74.41-1.17.53-.43.12-.89.18-1.37.18z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={toggleCode}
                className={`p-2 rounded ${
                  editor.isActive('code')
                    ? 'bg-slate-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                } transition-colors duration-200`}
                title="インラインコード"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                </svg>
              </button>
            </div>

            {/* リスト */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleBulletList}
                className={`p-2 rounded ${
                  editor.isActive('bulletList')
                    ? 'bg-slate-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                } transition-colors duration-200`}
                title="箇条書きリスト"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={toggleOrderedList}
                className={`p-2 rounded ${
                  editor.isActive('orderedList')
                    ? 'bg-slate-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                } transition-colors duration-200`}
                title="番号付きリスト"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 17h2v.5H2v-1zm0-6h2v.5H2v-1zm0-6h2v.5H2v-1zm4 9h14v-2H6v2zm0-6h14v-2H6v2zm0-6h14V3H6v2z"/>
                </svg>
              </button>
            </div>

            {/* 引用 */}
            <button
              type="button"
              onClick={toggleBlockquote}
              className={`p-2 rounded ${
                editor.isActive('blockquote')
                  ? 'bg-slate-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              } transition-colors duration-200`}
              title="引用"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
              </svg>
            </button>

            {/* 色選択 */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTextColor('#ef4444')}
                className="w-6 h-6 rounded border border-slate-200 bg-red-500 hover:scale-110 transition-transform duration-200"
                title="赤色"
              />
              <button
                type="button"
                onClick={() => setTextColor('#3b82f6')}
                className="w-6 h-6 rounded border border-slate-200 bg-blue-500 hover:scale-110 transition-transform duration-200"
                title="青色"
              />
              <button
                type="button"
                onClick={() => setTextColor('#10b981')}
                className="w-6 h-6 rounded border border-slate-200 bg-emerald-500 hover:scale-110 transition-transform duration-200"
                title="緑色"
              />
              <button
                type="button"
                onClick={() => setTextColor('#f59e0b')}
                className="w-6 h-6 rounded border border-slate-200 bg-amber-500 hover:scale-110 transition-transform duration-200"
                title="黄色"
              />
            </div>

            {/* フォーマットクリア */}
            <button
              type="button"
              onClick={clearFormatting}
              className="px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors duration-200"
              title="フォーマットをクリア"
            >
              クリア
            </button>
          </div>
        </div>

        {/* エディター本体 */}
        <EditorContent 
          editor={editor} 
          className="min-h-[200px] focus:outline-none rich-text-editor"
          placeholder={placeholder}
        />
      </div>

      {/* プレビュー */}
      {showPreview && (
        <div className="border border-slate-200 rounded-lg bg-white">
          <div className="border-b border-slate-200 p-3 bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700">プレビュー</h3>
          </div>
          <div className="p-4">
            <div 
              className="prose prose-slate max-w-none rich-text-editor"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
