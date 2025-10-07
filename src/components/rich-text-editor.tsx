"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bold,
  Italic,
  Undo,
  Redo,
  ImageIcon,
  Loader2,
  Underline,
  VideoIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { httpPost$AddFileToS3 } from "@/modules/commands/AddFileToS3/fetcher";
import { toast } from "sonner";



export const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
        getAttrs: (dom) => {
            const src = (dom as HTMLElement).querySelector('source')?.getAttribute('src');
            return { src };
        }
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // This structure renders a responsive video player.
    return [
      'video',
      mergeAttributes(HTMLAttributes, {
        class: 'max-w-full h-auto rounded-lg',
        controls: 'true',
        preload: 'metadata',
      }),
      ['source', { src: HTMLAttributes.src }],
    ];
  },

  addCommands() {
    return {
      setVideo: (options) => ({ commands }) => {
        // This command inserts the video node into the editor content.
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});
// --- End of Custom Extension ---

// A declaration to make TypeScript aware of our new `setVideo` command.
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string }) => ReturnType;
    };
  }
}


interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content = "",
  onChange,
  placeholder = "Start writing...",
}: RichTextEditorProps) {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Video, // Added our custom Video extension
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none h-[250px] overflow-y-auto p-4",
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleFileUpload = useCallback(async (fileType: 'image' | 'video') => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = `${fileType}/*`; // Accept only images or videos based on type

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const setLoading = fileType === 'image' ? setIsImageUploading : setIsVideoUploading;
      setLoading(true);

      try {
        // The same S3 upload endpoint can be used for any file type.
        const result = await httpPost$AddFileToS3("/api/s3-upload", file);

        if (result.success && result.result) {
          const chain = editor?.chain().focus();
          if (fileType === 'image') {
            chain?.setImage({ src: result.result }).createParagraphNear().run();
          } else {
            // Use our custom setVideo command
            chain?.setVideo({ src: result.result }).createParagraphNear().run();
          }
        } else {
          toast.error("Upload failed: " + result.message);
        }
      } catch (error) {
        toast.error("Upload error: " + (error instanceof Error ? error.message : String(error)));
      } finally {
        setLoading(false);
      }
    };

    input.click();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <Card className="w-full pt-1 gap-0">
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-muted" : ""}
          type="button"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFileUpload("image")}
          disabled={isImageUploading}
          type="button"
        >
          {isImageUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>
        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFileUpload("video")}
          disabled={isVideoUploading}
          type="button"
        >
          {isVideoUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <VideoIcon className="h-4 w-4" />
          )}
        </Button>
        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent editor={editor} placeholder={placeholder} />
    </Card>
  );
}
