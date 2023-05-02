import S from "@sanity/desk-tool/structure-builder";

import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import * as Structure from "@sanity/document-internationalization/lib/structure";

import {
  IoPeopleOutline,
  IoSparklesOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";

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
      S.divider(),

      Structure.getFilteredDocumentTypeListItems().find(
        ({ id }) => id === "post"
      ),
      S.listItem()
        .title("Featured Post")
        .icon(IoSparklesOutline)
        .child(
          S.document().schemaType("featuredPost").documentId("featuredPost")
        ),
      Structure.getFilteredDocumentTypeListItems().find(
        ({ id }) => id === "category"
      ),

      S.listItem()
        .title("Active Banner")
        .icon(IoSparklesOutline)
        .child(S.document().schemaType("activeBanner").documentId("activeBanner")),

      Structure.getFilteredDocumentTypeListItems().find(
        ({ id }) => id === "banner"
      ),

      Structure.getFilteredDocumentTypeListItems().find(
        ({ id }) => id === "highlight"
      ),

      S.divider(),

      S.listItem()
        .title("Team Members")
        .icon(IoPeopleOutline)
        .child(
          S.document()
            .schemaType("team")
            .documentId("team")
            .title("Team Members")
        ),
      Structure.getFilteredDocumentTypeListItems().find(
        ({ id }) => id === "person"
      ),
      S.divider(),

      Structure.getFilteredDocumentTypeListItems().find(
        ({ id }) => id === "jobs"
      ),

      S.divider(),

      S.listItem()
        .title("Privacy Policy")
        .icon(IoDocumentTextOutline)
        .child(
          S.document()
            .schemaType("privacy")
            .documentId("privacy")
            .title("Privacy Policy")
        ),

      // ...langStructure,

      // orderableDocumentListDeskItem({
      //   type: "post",
      //   title: "Posts",
      // }),
    ]);
};