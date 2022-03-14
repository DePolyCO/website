import S from "@sanity/desk-tool/structure-builder";

import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import * as Structure from "@sanity/document-internationalization/lib/structure";

// For document-internationalization
// export const getDefaultDocumentNode = (props) => {
//   if (props.schemaType === "myschema") {
//     return S.document().views(
//       Structure.getDocumentNodeViewsForSchemaType(props.schemaType)
//     );
//   }
//   return S.document();
// };

export default () => {
  // const langStructure = Structure.getFilteredDocumentTypeListItems();

  return S.list()
    .id("__root__")
    .title("Content")
    .items([
      Structure.getFilteredDocumentTypeListItems().find(
        ({ id }) => id === "seo"
      ),
      Structure.getFilteredDocumentTypeListItems().find(
        ({ id }) => id === "post"
      ),

      S.listItem()
        .title("Featured Article")
        .child(
          S.document()
            .schemaType("featuredArticle")
            .documentId("featuredArticle")
        ),
      Structure.getFilteredDocumentTypeListItems().find(
        ({ id }) => id === "category"
      ),
      // ...langStructure,

      // orderableDocumentListDeskItem({
      //   type: "post",
      //   title: "Posts",
      // }),
    ]);
};
