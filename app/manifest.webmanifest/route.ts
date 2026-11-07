import { school, schoolTitle } from "@/lib/school";
export function GET() { return Response.json({name:schoolTitle,short_name:"TCPS "+school.name,start_url:"/",display:"standalone",background_color:"#FBF7EF",theme_color:"#0B5D3B",icons:[{src:"/icon.svg",sizes:"any",type:"image/svg+xml",purpose:"any maskable"}]},{headers:{"Content-Type":"application/manifest+json"}}); }
