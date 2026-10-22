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
abstract: "An autonomous robotic manipulation pipeline in ROS2 and MoveIt 2 for multi-object pick-and-place and sorting with a 6-DOF UR5 arm. The framework integrates monocular AprilTag tracking with HSV color segmentation to estimate 6D object poses and classifications in real time. Dynamic planning scene reconstruction incorporates surrounding obstacles into the collision model, enabling collision-free Cartesian trajectory generation and reliable cube relocation within a simulated workspace."
---
Autonomous manipulation pipeline for a UR5 arm using MoveIt 2, AprilTag 6D pose estimation, and dynamic collision avoidance.