import fetch from "node-fetch";
import express from "express";
import fs from "fs";

var app = express();

var port = 3000;

app.listen(port, function (params) {
  console.log("server runs on port :", port);
});

app.get(`/employee/:id`, function (req, res) {
  fs.readFile("EmployeeDetail.json", function (err, result) {
    if (err) {
      console.log("failed on file reading");
    } else {
      const parseEMployeeData = JSON.parse(result);
      const getEmployeeData = parseEMployeeData.find(
        (emp) => emp.EmployeeId === req.params.id
      );
      if (getEmployeeData !== undefined) {
        res.send(getEmployeeData);
      } else {
        console.log("No employee found");
      }
    }
  });
});

async function getData(emp) {
  const empObj = emp;
  await fetch(`http://localhost:3000/project/${emp.ProjectId}`)
    .then((res) => res.json())
    .then((result) => {
      empObj["ProjectName"] = result.ProjectName;
      empObj["ProjectId"] = result.ProjectId;
    })
    .catch((err) => console.log("error in fetch", err));
  return empObj;
}

app.get(`/employee`, function (req, res) {
  fs.readFile("EmployeeDetail.json", function (err, result) {
    if (err) {
      console.log("failed on file reading");
    } else {
      const parseEMployeeData = JSON.parse(result);
      const responseSendAPI = [];
      parseEMployeeData.forEach((emp) => {
        const fr = getData(emp);

        fr.then(function (result) {
          console.log("new", result);
          responseSendAPI.push(result);
        }).then(() => console.log("responseSendAPI 222", responseSendAPI));

        //
      });
      console.log("responseSendAPI", responseSendAPI);
      res.send(responseSendAPI);
    }
  });
});

app.get(`/project/:id`, function (req, res) {
  fs.readFile("ProjectDetail.json", function (err, result) {
    if (err) {
      console.log("failed on file reading");
    } else {
      const parseProjectData = JSON.parse(result);
      const getProjectData = parseProjectData.find(
        (project) => project.ProjectId === req.params.id
      );
      if (getProjectData !== undefined) {
        res.send(getProjectData);
        return getProjectData;
      } else {
        console.log("No project found");
      }
    }
  });
});
