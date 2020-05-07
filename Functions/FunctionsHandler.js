//This file contains all the fucntions that we would use with
// proper documentation for which purpose and efficiency it is to be used

//Import all models for use all the time
const student = require('../models/Student');
const async = require('async');


//This function is usued to adhere to post for notes
exports.addStudent = async (req , res , next)=>{
    //Save to mongo collection
    try{
       const result = await student.create(req.body);
       console.log(result);
       res.status(200).send("Note saved");
    }catch(err){
        console.log(err);
        next(err);
    }
}

exports.getStudents = async (req , res , next)=>{
    try{
    console.log('called data');
    
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    console.log(skip);
    console.log(limit);
    
     // execute query with page and limit values
    const students = await student.find()
    .skip(skip)
    .limit(limit)
    .exec();
    console.log(students);

    //Send to res
    res.status(200).json(students);
    }catch(err){
      console.log(err);
      res.status(400).send(err);
    }
}

exports.deletePost = async (req , res , next)=>{
    try {
        //Delete by id
        const result = await student.findByIdAndDelete(req.params.id);
        res.send("Post deleted");
        console.log("Deleted");
    } catch (err) {
        console.log(err);
        res.status(400).send(err);

    }
}


exports.topThreeSchools = async (req , res , next)=>{
   try {

    console.log(req.query.result_type );
       const data =  await student.aggregate([
        {
            $project :{
                school_id : '$school.name',
                districtFrom : "$school.district",
                avgScore :  {
                   $cond : {
                       if :{$eq :[req.query.result_type  , 'annual']},
                       then : {$avg : "$subject.annual"},
                       else : {$avg : "$subject.quaterly"}
                   }
               },
            }
        },
        {
            $group : {
                _id : "$school_id",
                district : {
                    $first : "$districtFrom"
                },
                avg : {$avg : "$avgScore"}
            }
        },
        {
            $sort : {avg : -1}
        },
        {
            $limit : 3
        }
    ]).exec();

    return data;
   } catch (error) {
       console.log(err);
       res.status(400).send(error);
   }
}

exports.topThreeSchoolsByDistrict = async (req , res , next)=>{
     
    try {
        const data  =  await student.aggregate([
            {
                $match :{
                    'school.district' : req.query.district
                }
            },
             {
                 $project :{
                     school_id : '$school.name',
                     districtFrom : "$school.district",
                     avgScore :  {
                        $cond : {
                            if :{$eq :[req.query.result_type  , 'annual']},
                            then : {$avg : "$subject.annual"},
                            else : {$avg : "$subject.quaterly"}
                        }
                    },
                 }
             },
             {
                 $group : {
                     _id : "$school_id",
                     districtFrom : {
                         $first : "$districtFrom"
                     },
                     avgScore :  {$avg : "$avgScore"}
                 }
             },

            {
                $sort : {avgScore : -1}
            },
            {
                $limit : 3
            }
    
    
    
    ]).exec();

    return data

    } catch (error) {
        res.status(400).send(error);
    }
}

exports.topThreeStudents = async (req , res , next)=>{

    //Get top 3 students
    try{
        const data = await student.aggregate([
            {
                $project: {
                    _id: 1,
                    avg : {
                        $cond : {
                            if :{$eq :[req.query.result_type  , 'annual']},
                            then : {$avg : "$subject.annual"},
                            else : {$avg : "$subject.quaterly"}
                        }
                    },
                    name_of_student : 1,
                    school : 1,
                    district : "$school.district"
                }
            },
            //now sort in decending
            { $sort :{avg :-1}},
            //limit the results to
            {
                $limit : 3
            }
    
        ]).exec();
        return data;
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }

}

exports.topTenStudentsByDistrict = async(req , res , next)=>{

    //Get top 3 students
    try{
        const data = await student.aggregate([
            {
                $match: {'school.district' : req.query.district}
            },
            {
                $project: {
                    _id: 1,
                    avg : {
                        $cond : {
                            if :{$eq :[req.query.result_type  , 'annual']},
                            then : {$avg : "$subject.annual"},
                            else : {$avg : "$subject.quaterly"}
                        }
                    },
                    name_of_student : 1,
                    school : 1
                }
            },
            //now sort in decending
            { $sort :{avg :-1}},
            //limit the results to
            {
                $limit : 10
            }
    
        ]).exec();
        return data;
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }

    

}

exports.topTenStudentInSchool = async (req , res , next)=>{

    //Get top 3 students
    try{
        const data = await student.aggregate([
            {
                $match: {'school.name' : req.query.name}
            },
            {
                $project: {
                    _id: 1,
                    avg : {
                        $cond : {
                            if :{$eq :[req.query.result_type  , 'annual']},
                            then : {$avg : "$subject.annual"},
                            else : {$avg : "$subject.quaterly"}
                        }
                    },
                    name_of_student : 1,
                    school : 1
                }
            },
            //now sort in decending
            { $sort :{avg :-1}},
            //limit the results to
            {
                $limit : 10
            }
    
        ]).exec();
        return data;
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }

    

}

exports.BestStudent = async (req , res , next)=>{

    //Get top 3 students
    try{
        const data = await student.aggregate([
            {
                $match: {'school.name' : req.query.name}
            },
            {
                $project: {
                    _id: 1,
                    avg : {
                        $cond : {
                            if :{$eq :[req.query.result_type  , 'annual']},
                            then : {$avg : "$subject.annual"},
                            else : {$avg : "$subject.quaterly"}
                        }
                    },
                    subject : 1,
                    name_of_student : 1,
                    school : 1
                }
            },
            
            {
                $max : "$avg"
            }
    
        ]).exec();
        return data;
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }

    }

exports.BestStudentBySubject = async (req , res , next)=>{

    try{
        const data = await student.aggregate([
            {
                $match: {'subject.subject' : req.query.subject}
            },

            {
                $project: {
                    _id: 1,
                    requestedSubjectMarks : {
                        $filter: {
                            input: '$subject',
                            as: 'requiredSubject',
                            cond: {$eq: ['$$requiredSubject.subject', req.query.subject]}
                        }
                    },
                    name_of_student : 1,
                    school : 1
                }
            },
            {
                $project: {
                    _id: 1,
                    requestedSubjectMarks : {
                        $cond : {
                            if :{$eq :[req.query.result_type  , 'annual']},
                            then :{
                                $arrayElemAt: [ "$requestedSubjectMarks.annual", 0 ]
                            },
                            else : {
                                $arrayElemAt: [ "$requestedSubjectMarks.annual", 0 ]
                            }
                        }
                    } ,
                    name_of_student : 1,
                    school : 1
                }
            },
             //now sort in decending
             { $sort :{"requestedSubjectMarks" : -1}},
             //limit the results to
             {
                 $limit : 5
             }
        ]).exec();
        return data;
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }

}


exports.getAllAnalytics = (req , res , next)=>{
    //run all analytics functions parallely
    async.parallel({
        topThreeSchools : exports.topThreeSchools.bind(null , req , res),
        topTenStudentInSchool :exports.topTenStudentInSchool.bind(null , req , res),
        topThreeStudents  : exports.topThreeStudents.bind(null , req , res),
        topTenStudentsByDistrict : exports.topTenStudentsByDistrict.bind(null , req , res),
        BestStudentBySubject : exports.BestStudentBySubject.bind(null , req ,res),
        topThreeSchoolsByDistrict :exports.topThreeSchoolsByDistrict.bind(null ,req ,res),
    },
      function(err, results) {
        
        //Handle error for response
        if(!err)
        res.send(results);
        else res.status(400).send(err);

      });
}