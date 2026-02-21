---
layout: post
title: "Robotic Manipulation and Cube Swapping with UR5"
author: Giacomo Vianello
authors: <strong>G Vianello</strong>, S Ferracane
categories: Research
image: /images/ur5_cubes.png
code: https://github.com/GiacomoVianello-1/ros2_cube_swapping_with_ur5
paper: /pdfs/07_assignment2.pdf
venue: Intelligent Robotics - University of Padua
abstract: "A comprehensive ROS2 pipeline for robotic pick-and-place and sorting tasks using a UR5 manipulator. The project integrates MoveIt2 for motion planning, custom C++ servers for kinematics management, and computer vision for real-time color-based object detection and localization."
---
This project implements an autonomous manipulation pipeline for a UR-5 robotic arm to identify and swap the positions of two AprilTag-equipped cubes. The system integrates real-time pose estimation and color classification with MoveIt-based collision avoidance to reconstruct the table geometry and ensure safe motion planning. By maintaining a consistent virtual scene throughout the execution, the solution achieves a robust pick-and-place sequence within a simulated environment.