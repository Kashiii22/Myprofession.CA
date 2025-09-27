// app/content/[slug]/page.jsx
import { contents } from "../../../data/dummyData";
import ContentRenderer from "../../components/ContentRenderer";

export default function ContentPage({ params }) {
  // find content in all categories
  let contentItem;
  for (const cat in contents) {
    contentItem = contents[cat].find(c => c.slug === params.slug);
    if (contentItem) break;
  }
  if (!contentItem) return <div className="container mx-auto px-4 py-6">Content not found</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{contentItem.title}</h1>
      <ContentRenderer content={contentItem} />
    </div>
  );
}
