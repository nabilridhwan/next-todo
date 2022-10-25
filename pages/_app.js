import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	const queryClient = new QueryClient();
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<div className="w-11/12 m-auto">
					<Component {...pageProps} />
				</div>
			</QueryClientProvider>
		</>
	);
}

export default MyApp;
