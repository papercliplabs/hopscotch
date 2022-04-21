import Link from "next/link";
import {
  useGetUsersQuery,
} from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/auth";

const Index = () => {
  const { user } = useAuth();
  const { data: allUsersData } = useGetUsersQuery();

  return (
    <div>
      Go to the{" "}
      <Link href="/demo">
        <a>demo</a>
      </Link>{" "}
      page.
      <h2>Below is public user data</h2>
      <div>{JSON.stringify(allUsersData)}</div>
      <h2>Below is the current user</h2>
      <div>{JSON.stringify(user)}</div>
    </div>
  );
};

export default Index;
