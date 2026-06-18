"use client";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

const Card = ({ title, description, tags, image }: any) => {
  return (
    <StyledWrapper>
      <div className="">
        <article className="article-wrapper">
          <div className="image-container">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="image object-cover"
            />
          </div>
          <div className="project-info">
            <div className="flex justify-between">
              <div className="project-title">{title}</div>
              <div className="project-hover">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  fill="none"
                  stroke="currentColor"
                >
                  <line y2={12} x2={19} y1={12} x1={5} />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
            <div className="description">
              {description.slice(0, 40)}
              {description.length > 40 && "..."}
            </div>
            <div className="flex justify-between">
              <div className="types">
                {tags.map((tag: string, index: number) => (
                  <span key={index} className="project-type">
                    #{tag.toUpperCase()}
                  </span>
                ))}
              </div>
              <div className="">
                <Image
                  src={"/images/like.png"}
                  alt={title}
                  width={20}
                  height={20}
                  className="-rotate-[20deg] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .article-wrapper {
    width: 400px;
    margin: 0 auto;
    transition: 0.3s all ease-in-out;
    border-radius: 10px;
    padding: 5px;
    border: 3px solid #777777;
    cursor: pointer;
    background-color: white;

    &:hover {
      box-shadow: 10px 10px 0 #494949, 20px 20px 0 #252525;
      transform: translate(-10px, -10px);
    }

    &:active {
      box-shadow: none;
      transform: translate(0, 0);
    }
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 400px;
    object-fit: fill;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image {
    border-radius: 10px;
    object-fit: cover;
  }

  .project-info {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .project-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: black;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .description {
    font-size: 1rem;
    color: #444;
  }

  .types {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .project-type {
    background: #b2b2fd;
    color: #1a41cd;
    font-weight: bold;
    padding: 0.3em 0.7em;
    border-radius: 15px;
    font-size: 12px;
  }

  .project-hover {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    transition: all 0.3s ease;

    &:hover {
      transform: rotate(-45deg);
      background-color: #a6c2f0;
    }
  }

  @media (max-width: 768px) {
    .article-wrapper {
      max-width: 100%;
      margin: 10px;
    }

    .image-container {
      height: 250px;
    }

    .project-title {
      font-size: 1.2rem;
    }

    .description {
      font-size: 0.9rem;
    }

    .project-type {
      font-size: 10px;
      padding: 0.2em 0.5em;
    }
  }

  @media (max-width: 480px) {
    .article-wrapper {
      width: 300px;
      padding: 10px;
    }

    .image-container {
      height: 200px;
    }

    .project-title {
      font-size: 1rem;
    }

    .description {
      font-size: 0.8rem;
    }

    .types {
      gap: 5px;
    }

    .project-type {
      font-size: 8px;
      padding: 0.1em 0.3em;
    }
  }
`;

export default Card;
