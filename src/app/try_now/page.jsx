import NavbarComponent from "@/components/navbar/Navbar"
import BoardComponent from "@/components/chessboard/BoardComponent"
import MoveTable from "@/components/moveTable/MoveTable"
import ContextWrapper from "@/components/wrapper/contextWrapper"

function TrialPage() {
    return(
        <>
            <NavbarComponent />
            <main className="flex-row flex columns-2 justify-center align-middle items-center w-full">
			<div className="w-1/2 col-span-1 relative justify-center flex mt-5">
				<span>
                    <ContextWrapper>
				        <BoardComponent />
                    </ContextWrapper>
				</span>
			</div>
			<div className="text-white col-span-1 w-1/2 text-center text-7xl font-bold flex-row">
                <ContextWrapper>
                    <MoveTable />
                </ContextWrapper>
            </div>
		</main>
        </>
    )
}

export default TrialPage