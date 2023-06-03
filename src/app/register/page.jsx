import NavbarComponent from "@/components/navbar/Navbar"
import RegisterForm from "@/components/forms/RegisterForm"

function RegisterPage() {
    return(
        <>
            <NavbarComponent />
            <main className="flex flex-col columns-1 justify-center align-middle items-center w-full">
                <div className="text-white lg:text-4xl text-3xl font-semibold mb-6">Register using Provider</div>
                <RegisterForm />
            </main>
        </>
    )
}

export default RegisterPage