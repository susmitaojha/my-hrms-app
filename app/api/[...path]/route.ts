import { NextRequest, NextResponse } from "next/server";
import { postRegisterUser } from "./post-register-utility";
import { postLoginUser } from "./post-login-utility";
import { getEmployees } from "./get-employee-utility";
import { getSingleEmployee } from "./get-single-employee-utility";
import { updateEmployee } from "./update-employee-utility";
import { deleteEmployee } from "./delete-employee-utility";
import { addEmployee } from "./add-employee-utility";



export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params; // await the params
  const joinedPath = path.join('/'); // join the segments
  console.log("path", joinedPath);

  const { searchParams } = new URL(req.url);
  if (joinedPath === "getEmployees") {
    return await getEmployees(req);
  }
  if (joinedPath === "getSingleEmployee") {
    return await getSingleEmployee(req);
  }
  
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
  if (joinedPath === "addEmployee") {
    return await addEmployee(req);
  }
  if (joinedPath === "updateEmployee") {
    return await updateEmployee(req);
  }
  if (joinedPath === "deleteEmployee") {
    return await deleteEmployee(req);
  }

  return NextResponse.json({ status: 404, error: "Not found" });
}



