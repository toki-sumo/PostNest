'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Bold from '@tiptap/extension-bold';

export default function Editor({ content = '', onChange }: { content?: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // StarterKitのheadingは無効化してカスタムを使う
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Paragraph,
      Bold,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded p-4" >
      <MenuBar editor={editor} />
      < EditorContent editor={editor} className="prose max-w-none mt-2" />
    </div>
  );
}

function MenuBar({ editor }: { editor: any }) {
  return (
    <div className="flex gap-2 mb-2" >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 border rounded ${editor.isActive('bold') ? 'bg-gray-300' : ''}`
        }
        type="button"
      >
        Bold
      </button>
      < button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-2 py-1 border rounded ${editor.isActive('paragraph') ? 'bg-gray-300' : ''}`}
        type="button"
      >
        Paragraph
      </button>
      < button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 border rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
        type="button"
      >
        H1
      </button>
      < button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 border rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
        type="button"
      >
        H2
      </button>
      < button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 border rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
        type="button"
      >
        H3
      </button>
    </div>
  );
}
