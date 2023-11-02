import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";

const Home = () => {
  const [auth, setauth] = useAuth();
  const navigate = useNavigate();

  const checkUserValidation = async () => {
    try {
      const { data } = await axios.post(
        "/api/v2/seven-days",
        {
          id: auth.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (data.success) {
        navigate(`/question?exam_type=register_one`);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error.message);
      // window.location.href = "https://www.inboundacademy.in/";
    }
  };

  //
  return (
    <>
      <div class="content_wraper">
        <div class="logo">
          <div class="container">
            <a target="_blank" href="https://www.inboundacademy.in/">
              <img src="images/inbound-academy-logo.webp" alt="Logo" />
            </a>
          </div>
        </div>
        <div class="body_content">
          <div class="container">
            <div class="exam_start">
              <div class="exam_start_cnt">
                <div class="exam_img">
                  <img width="100%" src="images/0x0.webp" />
                </div>
                <div class="exam_guid">
                  <h2>Thank you for showing your interest</h2>
                  <p>
                    Read Carefully: Thoroughly understand questions and options
                    before selecting an answer.
                  </p>
                  <ul>
                    <li>
                      Elimination Strategy: Utilize elimination to increase the
                      likelihood of selecting the correct answer.
                    </li>
                    <li>
                      Single Answer: Remember, each question has only one
                      accurate option; choose wisely.
                    </li>
                    <li>
                      Time Management: Allocate time for each question; skip and
                      return if necessary.
                    </li>
                  </ul>
                </div>
              </div>
              <div class="exam_start_cta text-center">
                <button onClick={checkUserValidation} className="btn">
                  Start Exam
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer class="text-center">
          <div class="container">
            Copyright © 2023.{" "}
            <a href="https://www.transfunnel.com/" target="_blank">
              TransFunnel Consulting
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
