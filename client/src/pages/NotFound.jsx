import NotFoundImgae from "../assets/images/404-error-img.png"
import ButtonComponent from "../components/atoms/ButtonComponent";
const NotFound = () => {
  return (
    <div className="h-screen w-screen bg-no-repeat bg-center object-cover flex justify-center items-center">
      <div className="flex flex-col text-center gap-7">
        <img src={NotFoundImgae} alt="Not Found Image 404" className="w-[400px] mx-auto" />
        <h1 data-aos="fade-up" className="mt-4 text-5xl font-black text-[#0E384C]"><span className="text-base-color">Oops!</span> Page Not Found</h1>
        <p data-aos="fade-up" className="font-normal text-[#94afbb]">The page you are looking for does not exist</p>
        <div data-aos="fade-up" className="mx-auto">
          <ButtonComponent text={"Back to Home"} path={"/"} />
        </div>
      </div>

    </div>
  );
};

export default NotFound;