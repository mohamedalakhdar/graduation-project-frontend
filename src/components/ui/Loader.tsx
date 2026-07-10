
const Loader = ({className}: {className?: string}) => {
    return (
        <div className={`text-black flex justify-center items-center gap-1 ${className} cursor-not-allowed`}>
            <span className="loader"></span>
            <span>Loading</span>
        </div>
    )
}

export { Loader };
export default Loader;