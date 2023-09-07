import { getAuthSession } from "@/lib/auth";

const Dashboard = async () => {
  const session = await getAuthSession();

  return (
    <div>
      <p>Dashboard page</p>
      <p>{session?.user.name}</p>
    </div>
  );
};

export default Dashboard;
