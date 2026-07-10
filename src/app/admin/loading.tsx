export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-[url('/login_img.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-[#0a2f57]/80 backdrop-blur-xs/5"></div>
            <span className="global-loader"></span>
        </div>
    )
}