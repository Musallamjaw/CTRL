
import EditProfile from "./EditProfile";

export default function Settings() {

  return (
    <div className="p-6 mx-auto bg-white rounded-lg border lg:col-span-3 w-full lg:ml-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <EditProfile />
    </div>
  )
}
