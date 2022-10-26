import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastManagerProvider } from '../context/ToastManager';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	const queryClient = new QueryClient();
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<ToastManagerProvider>
					<div className="w-11/12 m-auto">
						<Component {...pageProps} />
					</div>
				</ToastManagerProvider>
			</QueryClientProvider>
		</>
	);
}

export default MyApp;
