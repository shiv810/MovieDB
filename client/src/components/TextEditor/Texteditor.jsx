import React, { useEffect, useState } from 'react'
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./Texteditor.css";

export const Texteditor = () => {
    const editorRef = React.useRef(null);
    const isMounted = React.useRef(false);
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],       
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
      
        [{ 'header': 1 }, { 'header': 2 }],               
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],    
        [{ 'indent': '-1'}, { 'indent': '+1' }],       
        [{ 'direction': 'rtl' }],                     
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }], 
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean']                                      
      ];
    useEffect(() => {
        if (!isMounted.current) {
            editorRef.current = new Quill(".editorContainer", {
                theme: "snow",
                modules: {
                    toolbar: toolbarOptions,
                },
                
            });
            isMounted.current = true;

            editorRef.current.on("text-change", () => {
                const editor = document.querySelector(".ql-editor");
                const editorHeight = editor.offsetHeight;
                const editorScrollHeight = editor.scrollHeight;
                if (editorHeight < editorScrollHeight) {
                    const diff = editorScrollHeight - editorHeight;
                    const newHeight = editorHeight + diff;
                    editor.style.minHeight = newHeight + "px";
                }
            });
        }
    }, [])

    return <div className="editorContainer"></div>
}
