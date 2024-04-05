import React, { useEffect } from 'react'

const ErrorAlert = ({ context }) => {
    const [show, setShow] = React.useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, 15000);
        return () => clearTimeout(timer);
    }, []);

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div role="alert" className="relative bg-red-500 text-white font-bold rounded px-4 py-2 m-2 max-w-full sm:w-auto sm:m-0">
                <div className="flex justify-between items-center">
                    <div>
                        Danger
                    </div>
                    <button onClick={() => setShow(false)} className="text-white">
                        Close
                    </button>
                </div>
                <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                    <p>{context}</p>
                </div>
            </div>
        </div>
    )
}

export default ErrorAlert