import { useParams } from "react-router-dom";

function Profile() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="flex min-h-screen bg-sky font-body text-ink">Profile for user {id}</div>
    )
}
export default Profile