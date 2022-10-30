import { IconArrowLeft } from "@tabler/icons";
import Link from "next/link";

const BackButton = ({ href }) => (
	<Link href={href} passHref>
		<button className="btn btn-square btn-ghost my-5" component="a">
			<IconArrowLeft />
		</button>
	</Link>
);

export default BackButton;
