import * as moment from "moment";
import {Certificate} from "pkijs";
import * as asn1js from "asn1js";
import {decode} from "base64-arraybuffer";

const formatDistinguishedName = (components) => {

    const nameMap = {
        country: 'C',
        organizationName: 'O',
        organizationalUnit: 'OU',
        commonName: 'CN',
        localityName: 'L',
        stateName: 'S',
        '2.5.4.12': 'T',
        '2.5.4.42': 'GN',
        '2.5.4.43': 'I',
        '2.5.4.4': 'SN',
        email: 'E-mail'
    }

    return Object.keys(components).filter(el => components[el])
        .map(key => `${nameMap[key]}=${components[key]}`)
        .join(',')
}
const validateToAndFrom = (from, to) => {
    if (!moment(from).isBefore(new Date())) {
        return false
    } else if (!moment(to).isAfter(new Date())) {
        return false
    }

    return true
}
const keyInformationFormatter = (outputObject, parentObj, typeValues) => {

    const rdnmap = {
        '2.5.4.6': 'C',
        '2.5.4.10': 'O',
        '2.5.4.11': 'OU',
        '2.5.4.3': 'CN',
        '2.5.4.7': 'L',
        '2.5.4.8': 'S',
        '2.5.4.12': 'T',
        '2.5.4.42': 'GN',
        '2.5.4.43': 'I',
        '2.5.4.4': 'SN',
        '1.2.840.113549.1.9.1': 'E-mail'
    }

    // Issuer
    for (const typeAndValue of typeValues) {
        // @ts-ignore
        const typeval = rdnmap[typeAndValue.type]

        if (typeval === 'E-mail') {
            outputObject[parentObj].components.commonName = typeAndValue.value.valueBlock.value
        } else if (typeval === 'CN') {
            outputObject[parentObj].components.commonName = typeAndValue.value.valueBlock.value
        } else if (typeval === 'OU') {
            outputObject[parentObj].components.organizationalUnit = typeAndValue.value.valueBlock.value
        } else if (typeval === 'O') {
            outputObject[parentObj].components.organizationName = typeAndValue.value.valueBlock.value
        } else if (typeval === 'L') {
            outputObject[parentObj].components.localityName = typeAndValue.value.valueBlock.value
        } else if (typeval === 'ST') {
            outputObject[parentObj].components.stateName = typeAndValue.value.valueBlock.value
        } else if (typeval === 'C') {
            outputObject[parentObj].components.country = typeAndValue.value.valueBlock.value
        }
    }

    outputObject[parentObj].distinguishedName = formatDistinguishedName(outputObject[parentObj].components)

    return outputObject

}
const formatCertificateIntoHumanObjects = (certificate) => {

    let output = {
        issuer: {
            distinguishedName: '',
            components: {
                email: '',
                commonName: '',
                organizationalUnit: '',
                organizationName: '',
                localityName: '',
                stateName: '',
                country: ''
            }
        },
        subject: {
            distinguishedName: '',
            components: {
                email: '',
                commonName: '',
                organizationalUnit: '',
                organizationName: '',
                localityName: '',
                stateName: '',
                country: ''
            }
        },
        validFrom: certificate.notBefore,
        validTo: certificate.notAfter,
        // isValid: validateToAndFrom(certificate.notBefore.value, certificate.notAfter.value),
        version: certificate.version
    }

    output = keyInformationFormatter(output, 'issuer', certificate.issuer.typesAndValues)
    output = keyInformationFormatter(output, 'subject', certificate.subject.typesAndValues)

    return output
}

const createCertificate = (certBuf) => {

    if (!certBuf) {
        return undefined
    }

    return new Certificate({ schema: asn1js.fromBER(certBuf).result })
}

const parseCertificate = (cert) => {

    const splitPEM = cert.split(`-----END CERTIFICATE-----`).map(el => {
        return el ? el.replace('-----BEGIN CERTIFICATE-----', '') : undefined
    }).filter(Boolean)

    const certBuf = splitPEM.map(el => el && decode(el)).filter(Boolean)

    return certBuf.map(el => createCertificate(el)).filter(Boolean).map(el => formatCertificateIntoHumanObjects(el))

}
