import React from "react";
import NavbarComponent from "@/components/navbar/Navbar";
import PageWrapper from "@/components/wrapper/pageWrapper";
import VariationsGrid from "@/components/grids/VariationsGrid";

const VariationPage = ({ params }) => {

    const openingName = params.opening;

    return(
        <PageWrapper>
            <NavbarComponent />
            <div className="flex w-full justify-center">
                <span className="lg:text-4xl text-3xl font-bold">
                    Pick Variation to Train
                </span>
            </div>
            <VariationsGrid opening={openingName}/>
        </PageWrapper>
    )
}

export default VariationPage;