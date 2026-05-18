import { NextRequest, NextResponse } from "next/server";
/*import { getMockTestFun } from "./get-register-utility";
import { getMockTestResult } from "./get-mockTest-result-utility";*/
import { postRegisterUser } from "./post-register-utility";
import { postLoginUser } from "./post-login-utility";


export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params; // await the params
  const joinedPath = path.join('/'); // join the segments
  console.log("path", joinedPath);

  const { searchParams } = new URL(req.url);

  // handle /api/exam-test/getmcqquestion
  /*if (joinedPath === "getmcqquestion") {
    const category_data = searchParams.get("category");
    return await getMockTestFun(category_data);
  }
  // handle /api/exam-test/getmockTestresult
  if (joinedPath === "getmockTestresult") {
    const result_id = Number(searchParams.get("result_id"));
    console.log("inside this path",result_id);
    // Call your function with both parameters (if needed)
    return await getMockTestResult(result_id);

  }*/
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await context.params;

  console.log(path, "params in post route");

  const joinedPath = path.join("/");

  if (joinedPath === "postRegisterUser") {
    return await postRegisterUser(req);
  }
  if (joinedPath === "postLoginUser") {
    return await postLoginUser(req);
  }

  return NextResponse.json({ status: 404, error: "Not found" });
}


