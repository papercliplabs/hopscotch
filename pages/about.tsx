import Link from "next/link";

export default function About() {
    return (
        <div>
            Welcome to the about page. Go to the{" "}
            <Link href="/test">
                <a>Home</a>
            </Link>{" "}
            page.
        </div>
    );
}
