import { NextRequest, NextResponse } from "next/server";
import { postRegisterUser } from "./post-register-utility";
import { postLoginUser } from "./post-login-utility";
import { getEmployees } from "./get-employee-utility";
import { getSingleEmployee } from "./get-single-employee-utility";
import { updateEmployee } from "./update-employee-utility";
import { deleteEmployee } from "./delete-employee-utility";
import { addEmployee } from "./add-employee-utility";
import { getDepartments } from "./get-departments-utility";
import { getRoles } from "./get-roles-utility";
import { getTeamLeads } from "./get-team-lead-utility";
import { addRole } from "./add-role-utility";
import { updateRole } from "./update-role-utility";
import { deleteRole } from "./delete-role-utility";
import { addDepartment } from "./add-departments-utility";
import { updateDepartment } from "./update-departments-utility";
import { deleteDepartment } from "./delete-departments-utility";
import { getAttendances } from "./get-attendances-utility";


export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params; // await the params
  const joinedPath = path.join('/'); // join the segments
  console.log("path", joinedPath);

  if (joinedPath === "getEmployees") {
    return await getEmployees(req);
  }
  if (joinedPath === "getSingleEmployee") {
    return await getSingleEmployee(req);
  }
  if (joinedPath === "getDepartments") {
    return await getDepartments(req);
  }
  if (joinedPath === "getRoles") {
    return await getRoles(req);
  }
  if (joinedPath === "getTeamLeads") {
    return await getTeamLeads(req);
  }
  if (joinedPath === "getAttendances") {
    return await getAttendances(req);
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
  if (joinedPath === "addRole") {
    return await addRole(req);
  }
  if (joinedPath === "addDepartment") {
    return await addDepartment(req);
  }
  if (joinedPath === "updateDepartment") {
    return await updateDepartment(req);
  }
  if (joinedPath === "updateRole") {
    return await updateRole(req);
  }
  if (joinedPath === "deleteRole") {
    return await deleteRole(req);
  }
  if (joinedPath === "deleteDepartment") {
    return await deleteDepartment(req);
  }
  return NextResponse.json({ status: 404, error: "Not found" });
}