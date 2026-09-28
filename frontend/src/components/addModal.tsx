import ReactDOM from "react-dom";

function AddGroup({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {

    if (!open) return null;

    return ReactDOM.createPortal(
        <>
            <div />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-200 p-12.5 z-[1000]">
                <button onClick={onClose}>X</button>
                {children}
            </div>
        </>,
        document.getElementById('portal')!
    )
}
export default AddGroup;