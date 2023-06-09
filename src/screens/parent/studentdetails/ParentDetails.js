import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DOMParser} from 'xmldom';
import GLOBALS from '../../../config/Globals';
import Loader from '../../../components/ProgressIndicator';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const ParentDetails = () => {
  let studentId = '';
  const [fatherName, setfatherName] = useState('');
  const [fatherContact, setfatherContact] = useState('');
  const [fatherQualification, setfatherQualification] = useState('');
  const [fatherOccupation, setfatherOccupation] = useState('');
  const [motherName, setmotherName] = useState('');
  const [motherContact, setmotherContact] = useState('');
  const [motherQualification, setmotherQualification] = useState('');
  const [motherOccupation, setmotherOccupation] = useState('');

  const [loading, setloading] = useState(true);
  const [failure, setfailure] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    AsyncStorage.getItem('StdID').then(value => {
      console.log(value);
      studentId = value;

      fetch(`${GLOBALS.PARENT_URL}RetrieveStdDetails`, {
        method: 'POST',
        body: `<?xml version="1.0" encoding="utf-8"?>
              <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
         <soap12:Body>
           <RetrieveStdDetails xmlns="http://www.m2hinfotech.com//">
             <studentId>${studentId}</studentId>
           </RetrieveStdDetails>
         </soap12:Body>
       </soap12:Envelope>
     `,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/soap+xml; charset=utf-8',
        },
      })
        .then(response => response.text())
        .then(response => {
          setloading(false);
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response);
          const v = xmlDoc.getElementsByTagName('RetrieveStdDetailsResult')[0]
            .childNodes[0].nodeValue;
          console.log(v);
          if (v === 'failure') {
            setfailure(false);
          } else {
            const rslt = JSON.parse(v);
            setfatherName(rslt[0].FaFistName);
            setfatherContact(rslt[0].faPhone);
            setfatherQualification(rslt[0].FaQualification);
            setfatherOccupation(rslt[0].FaOccupation);
            setmotherName(rslt[0].MoFistName);
            setmotherContact(rslt[0].maPhone);
            setmotherQualification(rslt[0].MoQualification);
            setmotherOccupation(rslt[0].MoOccupation);
          }
        })
        .catch(error => {
          setloading(false);
          console.log(error);
        });
    });
  };

  return (
    <View style={styles.container}>
      {failure ? (
        <Text style={styles.noData}>No Data Found</Text>
      ) : (
        <>
          <View style={styles.textView}>
            <Text style={styles.boldText}>Father Name:</Text>
            <Text style={styles.normalText}>{`${fatherName}`}</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.boldText}>Contact No:</Text>
            <Text style={styles.normalText}>{`${fatherContact}`}</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.boldText}>Qualification:</Text>
            <Text style={styles.normalText}>{`${fatherQualification}`}</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.boldText}>Occupation:</Text>
            <Text style={styles.normalText}>{`${fatherOccupation}`}</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.textView}>
            <Text style={styles.boldText}>Mother Name:</Text>
            <Text style={styles.normalText}>{`${motherName}`}</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.boldText}>Contact No:</Text>
            <Text style={styles.normalText}>{`${motherContact}`}</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.boldText}>Qualification:</Text>
            <Text style={styles.normalText}>{`${motherQualification}`}</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.boldText}>Occupation:</Text>
            <Text style={styles.normalText}>{`${motherOccupation}`}</Text>
          </View>
        </>
      )}
      {loading ? <Loader /> : null}
    </View>
  );
};

export default ParentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 125,
  },
  name: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  textView: {
    flexDirection: 'row',
    marginBottom: hp('1%'),
    marginTop: hp('1%'),
  },
  boldText: {
    fontSize: hp('2.7%'),

    fontWeight: 'bold',
    marginLeft: hp('2.5%'),
    flex: 1,
  },
  normalText: {
    fontSize: hp('3%'),
    flex: 2,
  },
  noData: {
    fontSize: hp('3%'),
    textAlign: 'center',
  },
  line: {
    borderColor: '#13C0CE',
    borderBottomWidth: wp('0.5%'),
    alignSelf: 'center',
    width: '90%',
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
});
