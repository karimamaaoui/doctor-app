export class DemandDoctor {

    _id?:string;
    state?: string;
    diploma: {
        diplomaName: string;
        year: string; 
    };
    client:{
        email:string,
        _id:string
    };
    experienceYears: number;
    address: string;
    location: {
        city: string;
        country: string;
        zipCode: string;
    };
    phoneNumber: string;
    hospital: {
        hospitalName: string;
        hospitalNumber: string;
        department: string;
        hiringDate: string; 
    };
    socialLinks: {
        linkedin: string;
        facebook: string;
    };
    specialities:string
}