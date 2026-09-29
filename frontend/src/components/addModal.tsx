import ReactDOM from "react-dom";

function AddGroup({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {

    if (!open) return null;

    return ReactDOM.createPortal(
        <>
            <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-1000'/>

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-200 p-12.5 z-1000 flex justify-between gap-7">
                {children}
                <button onClick={onClose} className='right-0'>
                  <i className="fa-solid fa-square-xmark"></i>
                </button>
            </div>
        </>,
        document.getElementById('portal')!
    )
}
export default AddGroup;