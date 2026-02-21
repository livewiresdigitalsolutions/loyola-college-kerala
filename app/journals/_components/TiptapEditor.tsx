"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link2, Image, Undo, Redo, Minus,
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

function MenuBar({ editor }: { editor: any }) {
  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `p-2 rounded-md transition-colors ${
      active ? "bg-primary/10 text-primary" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
    }`;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))} title="Bold">
        <Bold size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))} title="Italic">
        <Italic size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive("underline"))} title="Underline">
        <UnderlineIcon size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive("strike"))} title="Strikethrough">
        <Strikethrough size={16} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive("heading", { level: 1 }))} title="Heading 1">
        <Heading1 size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))} title="Heading 2">
        <Heading2 size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive("heading", { level: 3 }))} title="Heading 3">
        <Heading3 size={16} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))} title="Bullet List">
        <List size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))} title="Numbered List">
        <ListOrdered size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))} title="Quote">
        <Quote size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive("codeBlock"))} title="Code Block">
        <Code size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)} title="Horizontal Rule">
        <Minus size={16} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btnClass(editor.isActive({ textAlign: "left" }))} title="Align Left">
        <AlignLeft size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btnClass(editor.isActive({ textAlign: "center" }))} title="Align Center">
        <AlignCenter size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btnClass(editor.isActive({ textAlign: "right" }))} title="Align Right">
        <AlignRight size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={btnClass(editor.isActive({ textAlign: "justify" }))} title="Justify">
        <AlignJustify size={16} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button type="button" onClick={addLink} className={btnClass(editor.isActive("link"))} title="Add Link">
        <Link2 size={16} />
      </button>
      <button type="button" onClick={addImage} className={btnClass(false)} title="Add Image">
        <Image size={16} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={`${btnClass(false)} disabled:opacity-30`} title="Undo">
        <Undo size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={`${btnClass(false)} disabled:opacity-30`} title="Redo">
        <Redo size={16} />
      </button>
    </div>
  );
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TiptapLink.configure({ openOnClick: false }),
      TiptapImage,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
  });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
