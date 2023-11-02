import axios from "axios";
import React, { useEffect, useState } from "react";
import CountDown from 'react-countdown';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactWebcam from "react-webcam";
import { useAuth } from "../context/auth";
import Spinner from "./Spinner";

function Question() {
  const navigate = useNavigate();
  const [Question, setQuestion] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [auth, setauth] = useAuth();
  const [Update, setUpdate] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ExamTime, setExamTime] = useState(0);
  const search = useLocation().search;

  const exam_type = new URLSearchParams(search).get("exam_type");

  const makeUniqueCategory = (arr) => {
    let set = new Set();
    arr.forEach((item) => {
      // console.log(item.category);

      set.add(item.category_name.replaceAll("_", " "));
    });

    setCategory([...set]);
  };
  const handleOptionSelect = (questionId, optionId, e) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      [questionId]: optionId,
    }));
    changeHandleer(e);
  };

  const calculateAnswer = () => {
    const trackResults = Question[currentQuestion];
    Update.forEach((item) => {
      if (item._id === trackResults._id) {
        if (item.user_res === null) {
          toast.error("Answer is required!");
        } else {
          setCurrentQuestion(currentQuestion + 1);
        }
      }
    });
  };


  //get all question from database

  //lifecycle hooks

  const getQuestion = async () => {
    try {
      const { data } = await axios.post(
        "/api/v2/questions",
        {
          exam_name: exam_type,
        }, { headers: { Authorization: `Bearer ${auth.token}` } }

      );

      if (data.success) {
        setQuestion(data.data);
        makeUniqueCategory(data.data);
        setIsLoading(false);
        setUpdate(data.data);
        setExamTime(data.examTiming);

        document.documentElement.requestFullscreen();
      } else {
        toast.error(data.msg);
        localStorage.removeItem("auth");
        window.location.href = "https://www.inboundacademy.in/";
      }
    } catch (error) {
      // console.log(error.message);
      toast.error("please contact us!");
      localStorage.removeItem("auth");
      window.location.href = "https://www.inboundacademy.in/";
    }
  };

  function changeHandleer(e) {
    const userAnswer = Number(e.target.value);
    Update.forEach((item) => {
      if (item._id === Question[currentQuestion]._id) {
        item.user_res = userAnswer;
      }
    });
  }
  // onsubmit
  async function onSubmitHandler() {
    try {
      const { data } = await axios.post(
        "/api/v2/answer-response",
        {
          userId: auth.user._id,
          userAnswer: Update,
          exam_name: exam_type,
        }
      );

      if (data.success) {
        setauth({ ...auth, type: exam_type, answer_id: data.data._id });
        navigate("/result");
        localStorage.clear();
      } else {
        toast.error("Exam submitted already");
        navigate("/result");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("something went wrong");
    }
  }


  //function for disable copy command
  const disableCopy = (e) => {

    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
    }
  };

  //disable right click
  const disableRightClick = (e) => {
    e.preventDefault();
  };
  //render the timers
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      onSubmitHandler();

    } else {
      // Render a countdown
      return <span>0{hours}:{minutes}:{seconds}</span>;
    }
  };


  useEffect(() => {
    getQuestion();


    window.addEventListener("keydown", disableCopy);
    window.addEventListener("contextmenu", disableRightClick);

    window.onbeforeunload = (e) => {
      e.returnValue = 'Are you sure you want to leave the page?';
    };


    return () => {

      window.removeEventListener("keydown", disableCopy);
      window.onbeforeunload = null;
    };

    // eslint-disable-next-line
  }, []);
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="content_wraper">
          <div className="logo">
            <div className="container">
              <a target="_blank" href="https://assessment.inboundacademy.in">
                <img src="images/inbound-academy-logo.webp" alt="Logo" />
              </a>
            </div>
          </div>
          <div className="refresh">
            <div className="refresh-inner">Don't Refresh the Page, or Your Test Will Be Submitted Automatically.</div>
          </div>
          <div className="body_content">
            <div className="container">
              <div className="exam_wrap">
                <div className="row">
                  <div className="col-md-9">
                    <div className="exam_title">
                      <h1>Inbound Academy Assessement Test</h1>
                    </div>
                    {/* <div className="exam_cats">
               <span>{Question?.[currentQuestion]?.category}</span>
             </div> */}
                    <div className="exam_cats">
                      {category.map((item) => (
                        <span
                          className={
                            (Question?.[
                              currentQuestion
                            ]?.category_name).replaceAll("_", " ") == item
                              ? "active_cat"
                              : ""
                          }
                        >
                          {item}
                        </span>
                      ))}
                      {/* <span className="active_cat">

                 {Question?.[currentQuestion]?.category}
               </span>
               <span>PHP</span>
               <span>MYSQL</span> */}
                    </div>
                    <div className="exam_qustions">
                      <div className="qus_nums">
                        <span>{`${currentQuestion + 1} of ${Question.length
                          }`}</span>
                      </div>
                      <div className="qus_ans">
                        <div className="qustion">
                          {Question?.[currentQuestion]?.question}
                        </div>
                        <div className="qustion_mcqs">
                          <ul type="A">
                            {Question?.[currentQuestion]?.options?.map(
                              (option, index) => (
                                <label key={index} className="ans-label">
                                  <input
                                    type="radio"
                                    name={`question-${Question?.[currentQuestion]?._id}`}
                                    value={index + 1}
                                    checked={
                                      selectedOptions[
                                      Question?.[currentQuestion]?._id
                                      ] === index
                                    }
                                    onChange={(e) =>
                                      handleOptionSelect(
                                        Question?.[currentQuestion]?._id,
                                        index,
                                        e
                                      )
                                    }
                                  />
                                  <span></span>
                                  {option}
                                </label>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="exam_qustions_btns text-right">
                      {currentQuestion >= 1 ? (
                        <button
                          onClick={() =>
                            setCurrentQuestion(currentQuestion - 1)
                          }
                          className=" btn"
                        >
                          <i className="fa-solid fa-angles-left"></i>&nbsp;Back
                        </button>
                      ) : (
                        ""
                      )}

                      {currentQuestion + 1 === Question.length ? (
                        <button
                          className="btn"
                          type="submit"
                          onClick={() => onSubmitHandler()}
                        >
                          Submit Exam
                        </button>
                      ) : (
                        <button
                          onClick={() => calculateAnswer()}
                          className="btn"
                        >
                          Next&nbsp;<i className="fa-solid fa-angles-right"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="video_section">
                      <div className="video-inner">
                        <ReactWebcam width="100%" />
                        <div className="exam_time">
                          Time Remaining: &nbsp;{ExamTime && <CountDown
                            date={Date.now() + (ExamTime * 60000)} intervalDelay={0}
                            precision={3} renderer={renderer} />}
                          <strong>
                            <span id="timer"></span>
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="text-center">
            <div className="container">
              Copyright © 2023.{" "}
              <a href="https://www.transfunnel.com/" target="_blank">
                TransFunnel Consulting
              </a>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

export default Question;
