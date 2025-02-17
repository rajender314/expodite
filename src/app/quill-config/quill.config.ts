import { QuillModule } from "ngx-quill";

export const quillConfig: QuillModule = {
  toolbar: {
    // container: [
    //   ["bold", "italic", "underline", "strike"],
    //   [{ header: 1 }, { header: 2 }],
    //   [{ list: "ordered" }, { list: "bullet" }],
    //   [{ size: ["small", false, "large", "huge"] }],
    //   [{ header: [1, 2, 3, 4, 5, 6, false] }],
    //   [{ font: [] }],
    //   ["clean"],
    // ],

    container: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      // ["code-block"],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      // [{ script: "sub" }, { script: "super" }], // superscript/subscript
      // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      // [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ font: [] }],
      // [{ align: [] }],

      ["clean"], // remove formatting button

      // ["link"],
      // ["link", "image", "video"],
    ],
  },
  mention: {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ["@", "#"],
    source: (searchTerm, renderList, mentionChar) => {
      let values;

      if (mentionChar === "@") {
        values = [
          { id: 3, value: "Fredrik Sundqvist 2" },
          { id: 4, value: "Patrik Sjölin 2" },
        ];
      } else {
        values = [
          {
            id: 1,
            value: "Fredrik Sundqvist",
            link: "https://google.com",
          },
          { id: 2, value: "Patrik Sjölin" },
        ];
      }

      if (searchTerm.length === 0) {
        renderList(values, searchTerm);
      } else {
        const matches = [];
        for (let i = 0; i < values.length; i++)
          if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase()))
            matches.push(values[i]);
        renderList(matches, searchTerm);
      }
    },
  },
  "emoji-toolbar": true,
  "emoji-textarea": true,
  "emoji-shortname": true,
  keyboard: {
    bindings: {
      enter: {
        key: 13,
        handler: (range, context) => {
          console.log(range, context, 7863);
          return true;
        },
      },
    },
  },
};
